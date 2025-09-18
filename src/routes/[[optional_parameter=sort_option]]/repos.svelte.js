import { current_tab } from './current_tab.svelte.js'
import { excluded_topics } from './excluded_topics.svelte.js'
import { hidden_repos } from './hidden_repos.svelte.js'
import { num_of_repos_to_render } from './num_of_repos_to_render.svelte.js'
import { sort_option } from './sort_option.svelte.js'

import { filter_blacklisted_repos_based_on_current_tab } from './repos_filter_functions.js'
import { sort_repos_based_on_sort_option } from './repos_sort_functions.js'

import { PUBLIC_BACKEND_URL } from '$env/static/public' // https://svelte.dev/docs/kit/$env-static-public

const create_repos = () => {
   let all = $state([])
   let to_show = $derived.by(() => { // a bruteforce hammer solution, but it's fine. what causes the slowness is the rendering
      if (all.length > 1) { // repos.fetch() returns an array of one element if there's an error
         let repos_to_show = JSON.parse(JSON.stringify(all))
         repos_to_show = sort_repos_based_on_sort_option(repos_to_show, sort_option.option)
         repos_to_show = repos_to_show.map((repo, index) => ({...repo, rank: index+1}))
         repos_to_show = filter_blacklisted_repos_based_on_current_tab(repos_to_show, hidden_repos.ids, current_tab.tab)
         //repos_to_show = repos_to_show.slice(0, 100)  // for debugging performance problem
         return repos_to_show
      } else {
         return [] // or actually_shown can't derive from this
      }
   })
   let actually_shown = $derived(to_show.slice(0, num_of_repos_to_render.value))

   let hidden_tab_repos_count = $derived.by(() => { // don't just use hidden_repos.ids.length because when a hidden repo is no longer in top 1000, it still get counted
      let count = 0
      all.forEach(repo => {
         if (hidden_repos.ids.includes(repo.id))
            count++
      })
      return count
   })
   let explore_tab_repos_count = $derived(1000 - hidden_tab_repos_count)
   let excluded_repos_count = $derived.by(() => {
      let count = 0
      to_show.forEach(repo => {
         if (repo.topics.some(topic => excluded_topics.topics.includes(topic))) // if one of the repo topic is in excluded_topics | https://stackoverflow.com/q/16312528/9157799
            count++
      })
      return count
   })

   return {
      get all() { return all },
      fetch: async () => { // to be run at init hook: https://svelte.dev/docs/kit/hooks#Shared-hooks-init
         try { // Typically we don't need try catch. But when a service is crashed in Railway, now the endpoint is pointing to Railway itself which doesn't allow CORS, which cause the fetch to fail (fetch will not fail if it's just an HTTP error).
            const response = await fetch(`${PUBLIC_BACKEND_URL}/repositories`)
            if (response.ok) { // https://developer.mozilla.org/en-US/docs/Web/API/Response/ok
               const repositories = await response.json()
               all = repositories
            } else { // HTTP error 503 Service Unavailable (on cloud provider side): The server is currently unable to handle the request due to a temporary overload or scheduled maintenance
               console.log(response.text()) // https://svelte.dev/examples/await-blocks
               all = ['an array with one element']
            }
         } catch (err) { // failed to fetch because of CORS error
            console.log(err)
            all = ['an array with one element']
         }
      },
      get to_show() { return to_show },
      get actually_shown() { return actually_shown },
      get count() {
         return {
            get hidden_tab() { return hidden_tab_repos_count },
            get explore_tab() { return explore_tab_repos_count },
            get excluded() { return excluded_repos_count }
         }
      }
   }
}

export const repos = create_repos() // create a singleton by running the function inside this file | https://nodejs.org/docs/latest/api/modules.html#caching
import { num_of_repos_to_render } from './num_of_repos_to_render.svelte.js'

import { browser } from '$app/environment' // https://svelte.dev/docs/kit/$app-environment
import { page } from '$app/state' // https://stackoverflow.com/a/68578884/9157799

const create_sort_option = () => {
   let option = $derived.by(() => {
      if (browser) {
         if (page.url.pathname == '/')                       return 'stargazers_count'
         if (page.url.pathname == '/sorted-by-pr')           return 'total_thumbs_up_of_top_5_closed_pr_since_1_year'
         if (page.url.pathname == '/sorted-by-issues')       return 'total_thumbs_up_of_top_5_closed_issues_since_1_year'
         if (page.url.pathname == '/sorted-by-code-size')    return 'code_size'
         if (page.url.pathname == '/sorted-by-project-size') return 'project_size'
         if (page.url.pathname == '/sorted-by-repo-size')    return 'repo_size'
      } else {
         return 'stargazers_count'
      }
   })

   return {
      get option() { return option }
   }
}

export const sort_option = create_sort_option() // create a singleton by running the function inside this file | https://nodejs.org/docs/latest/api/modules.html#caching
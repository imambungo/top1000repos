import { num_of_repos_to_render } from './num_of_repos_to_render.svelte.js'

const create_sort_option = () => {
   let option = $state('stargazers_count')

   return {
      get option() { return option },
      set option(v) {
         if (v != option) {
            num_of_repos_to_render.value = 50
            option = v
            num_of_repos_to_render.increase_gradually({by: 10, until: 1000, every_milliseconds: 80})
         }
      }
   }
}

export const sort_option = create_sort_option() // create a singleton by running the function inside this file | https://nodejs.org/docs/latest/api/modules.html#caching
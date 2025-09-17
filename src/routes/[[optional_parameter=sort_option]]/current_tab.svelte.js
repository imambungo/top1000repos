import { num_of_repos_to_render } from './num_of_repos_to_render.svelte.js'

const create_current_tab = () => {
   let tab = $state('explore')

   return {
      get tab() { return tab },
      set tab(v) {
         if (v != tab) {
            num_of_repos_to_render.value = 50
            tab = v
            num_of_repos_to_render.increase_gradually({by: 10, until: 1000, every_milliseconds: 80})
         }
      }
   }
}

export const current_tab = create_current_tab() // create a singleton by running the function inside this file | https://nodejs.org/docs/latest/api/modules.html#caching
import { writable, get } from 'svelte/store'  // get: https://stackoverflow.com/a/61585688/9157799

const create_num_of_repos_to_render = () => {  // https://svelte.dev/tutorial/custom-stores
   const { subscribe, set } = writable(0)

   let gradual_increase_timeoutID = -1  // https://developer.mozilla.org/en-US/docs/Web/API/clearTimeout#notes

   const modified_set = (value) => {
      set(value)
      clearTimeout(gradual_increase_timeoutID)  // https://developer.mozilla.org/en-US/docs/Web/API/clearTimeout#notes
   }

   return {
      subscribe,  // https://svelte.dev/tutorial/custom-stores
      set: modified_set,
      increase_gradually: ({by, until, every_milliseconds}) => {
         let current_num_of_repos = get({subscribe}) // get: https://stackoverflow.com/a/61585688/9157799

         const gradual_increase_recursion = () => {
            current_num_of_repos += by
            set(current_num_of_repos)
            if (current_num_of_repos < until)
               gradual_increase_timeoutID = setTimeout(gradual_increase_recursion, every_milliseconds) // https://stackoverflow.com/q/63503762/9157799
         }

         gradual_increase_recursion()
      }
   }
}

export const num_of_repos_to_render = create_num_of_repos_to_render()
const create_num_of_repos_to_render = () => {
   let num_of_repos_to_render = $state(0)
   let gradual_increase_timeoutID = -1  // https://developer.mozilla.org/en-US/docs/Web/API/clearTimeout#notes

   return {
      get value() { return num_of_repos_to_render },
      set value(n) {
         clearTimeout(gradual_increase_timeoutID)  // https://developer.mozilla.org/en-US/docs/Web/API/clearTimeout#notes
         num_of_repos_to_render = n
      },
      increase_gradually: ({by, until, every_milliseconds}) => {
         const gradual_increase_recursion = () => {
            num_of_repos_to_render += by
            if (num_of_repos_to_render < until)
               gradual_increase_timeoutID = setTimeout(gradual_increase_recursion, every_milliseconds) // https://stackoverflow.com/q/63503762/9157799
         }

         gradual_increase_recursion()
      }
   }
}

export const num_of_repos_to_render = create_num_of_repos_to_render() // create a singleton by running the function inside this file | https://nodejs.org/docs/latest/api/modules.html#caching
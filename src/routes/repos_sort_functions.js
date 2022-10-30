export const sort_repos_by_stars = repos => {
   const compareStars = (a, b) => { // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
      if (a.stargazers_count > b.stargazers_count)
         return -1 // a first, then b
      if (a.stargazers_count < b.stargazers_count)
         return 1 // b first, then a
      return 0
   }
   return repos.sort(compareStars) // https://svelte.dev/tutorial/updating-arrays-and-objects
}
export const sort_repos_based_on_sort_option = (repos, sort_option) => {
   const compare = (a, b) => {
      if (a[sort_option] > b[sort_option]) // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_Objects#objects_and_properties
         return -1 // a first, then b
      if (a[sort_option] < b[sort_option])
         return 1 // b first, then a
      return 0
   }
   return repos.sort(compare)
}
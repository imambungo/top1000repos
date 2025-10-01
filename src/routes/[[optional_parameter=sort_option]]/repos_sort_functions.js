export const sort_repos_based_on_sort_option = (repos, sort_option) => {
   const compare = (a, b) => {
      a = a[sort_option] // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_Objects#objects_and_properties
      b = b[sort_option]
      a = parseInt(a) // if sorting for size, size is string because it's bigint (2^64) in PostgreSQL: https://stackoverflow.com/a/74231479/9157799
      b = parseInt(b) // no need to use BigInt() because JS number can handle up to 2^53
      if (a > b) // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_Objects#objects_and_properties
         return -1 // a first, then b
      if (a < b)
         return 1 // b first, then a
      return 0
   }
   return repos.sort(compare)
}
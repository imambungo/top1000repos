export const sort_repos_based_on_sort_option = (repos, sort_option) => {
   const sort_repos_by_stars = repos => {
      const compareStars = (a, b) => { // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
         if (a.stargazers_count > b.stargazers_count)
            return -1 // a first, then b
         if (a.stargazers_count < b.stargazers_count)
            return 1 // b first, then a
         return 0
      }
      return repos.sort(compareStars) // https://svelte.dev/tutorial/updating-arrays-and-objects
   }
   
   const sort_repos_by_top_5_PR_thumbs_up = repos => {
      const compare_top_5_PR_thumbs_up = (a, b) => {
         if (a.top_5_pr_thumbs_up > b.top_5_pr_thumbs_up)
            return -1 // a first, then b
         if (a.top_5_pr_thumbs_up < b.top_5_pr_thumbs_up)
            return 1 // b first, then a
         return 0
      }
      return repos.sort(compare_top_5_PR_thumbs_up) // https://svelte.dev/tutorial/updating-arrays-and-objects
   }

   const sort_repos_by_number_of_closed_pr = repos => {
      const compare_number_of_closed_pr = (a, b) => {
         if (a.num_of_closed_pr_since_1_year > b.num_of_closed_pr_since_1_year)
            return -1 // a first, then b
         if (a.num_of_closed_pr_since_1_year < b.num_of_closed_pr_since_1_year)
            return 1 // b first, then a
         return 0
      }
      return repos.sort(compare_number_of_closed_pr) // https://svelte.dev/tutorial/updating-arrays-and-objects
   }
   
   if (sort_option == 'stars')
      return sort_repos_by_stars(repos)
   if (sort_option == 'top 5 pr thumbs up')
      return sort_repos_by_top_5_PR_thumbs_up(repos)
   if (sort_option == 'number of closed pr')
      return sort_repos_by_number_of_closed_pr(repos)
}
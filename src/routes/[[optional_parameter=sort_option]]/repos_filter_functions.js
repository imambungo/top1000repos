export const filter_repos_based_on_current_tab = (repos, bookmared_repos_ids, repo_id_blacklist, current_tab) => {
   const filter_only_repos_not_in_list = (repos, repo_id_list) => {
      return repos.filter(repo => !repo_id_list.includes(repo.id))
   }

   const filter_only_repos_in_list = (repos, repo_id_list) => {
      return repos.filter(repo => repo_id_list.includes(repo.id))
   }

   if (current_tab == 'explore') {
      repos = filter_only_repos_not_in_list(repos, bookmared_repos_ids)
      repos = filter_only_repos_not_in_list(repos, repo_id_blacklist)
      return repos
   } else if (current_tab == 'bookmark') {
      return filter_only_repos_in_list(repos, bookmared_repos_ids)
   } else if (current_tab == 'blacklist') {
      return filter_only_repos_in_list(repos, repo_id_blacklist)
   } else {
      return repos
   }
}
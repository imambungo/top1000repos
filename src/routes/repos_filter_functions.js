export const filter_blacklisted_repos_based_on_current_tab = (repos, repo_id_blacklist, current_tab) => {
   const filter_out_blacklisted_repos = (repos, repo_id_blacklist) => {
      const not_blacklisted_repo = repo => {
         if (repo_id_blacklist.includes(repo.id))
            return false
         else
            return true
      }
      return repos.filter(not_blacklisted_repo)
   }
   
   const filter_only_blacklisted_repos = (repos, repo_id_blacklist) => {
      const is_blacklisted_repo = repo => {
         if (repo_id_blacklist.includes(repo.id))
            return true
         else
            return false
      }
      return repos.filter(is_blacklisted_repo)
   }

   if (current_tab == 'explore')
      return filter_out_blacklisted_repos(repos, repo_id_blacklist)
   if (current_tab == 'blacklist')
      return filter_only_blacklisted_repos(repos, repo_id_blacklist)
   else
      return repos
}

// export const filter_whitelisted_repos_based_on_current_tab = (repos, repo_id_whitelist, current_tab) => {
//    const filter_out_whitelisted_repos = (repos, repo_id_whitelist) => {
//       const not_whitelisted_repo = repo => {
//          if (repo_id_whitelist.includes(repo.id))
//             return false
//          else
//             return true
//       }
//       return repos.filter(not_whitelisted_repo)
//    }
   
//    const filter_only_whitelisted_repos = (repos, repo_id_whitelist) => {
//       const is_whitelisted_repo = repo => {
//          if (repo_id_whitelist.includes(repo.id))
//             return true
//          else
//             return false
//       }
//       return repos.filter(is_whitelisted_repo)
//    }

//    if (current_tab == 'explore')
//       return filter_out_whitelisted_repos(repos, repo_id_whitelist)
//    if (current_tab == 'whitelist')
//       return filter_only_whitelisted_repos(repos, repo_id_whitelist)
//    else
//       return repos
// }
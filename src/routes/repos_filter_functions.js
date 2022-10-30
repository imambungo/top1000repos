export const filter_out_repos_with_excluded_topics = (repos, excluded_topics) => {
   const no_excluded_topics = repo => {
      if (repo.topics.some(topic => excluded_topics.includes(topic))) // if one of the repo topic is in excluded_topics | https://stackoverflow.com/q/16312528/9157799
         return false
      return true
   }
   return repos.filter(no_excluded_topics)
}

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
}
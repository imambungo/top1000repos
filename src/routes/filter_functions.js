export const filter_out_repos_with_excluded_topics = (repos, excluded_topics) => {
   const no_excluded_topics = repo => {
      if (repo.topics.some(topic => excluded_topics.includes(topic))) // if the repo topics is in excluded topics | https://stackoverflow.com/q/16312528/9157799
         return false
      return true
   }
   return repos.filter(no_excluded_topics)
}

export const filter_out_blacklisted_repos = (repos, repo_id_blacklist) => {
   const not_blacklisted_repo = repo => {
      if (repo_id_blacklist.includes(repo.id))
         return false
      else
         return true
   }
   return repos.filter(not_blacklisted_repo)
}

export const filter_only_blacklisted_repos = (repos, repo_id_blacklist) => {
   const is_blacklisted_repo = repo => {
      if (repo_id_blacklist.includes(repo.id))
         return true
      else
         return false
   }
   return repos.filter(is_blacklisted_repo)
}
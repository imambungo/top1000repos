export const filter_out_repos_with_excluded_topics = (repos, excluded_topics) => {
   const no_excluded_topics = repo => {
      if (repo.topics.some(topic => excluded_topics.includes(topic))) // if the repo topics is in excluded topics | https://stackoverflow.com/q/16312528/9157799
         return false
      return true
   }
   return repos.filter(no_excluded_topics)
}
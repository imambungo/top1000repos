import { local_storage as ls } from '$lib/local_storage.js'

const create_marked_repos = (mark) => {
   let ids = $state([])

   return {
      get ids() { return ids },
      load_from_local_storage: () => ids = ls.getItem(mark) || [], // to be run at client init hook: https://svelte.dev/docs/kit/hooks#Shared-hooks-init
      add: repo_id => {
         ids = [...ids, repo_id]
         ls.setItem(mark, ids)
      },
      remove: repo_id => {
         ids = ids.filter(id => id != repo_id)
         ls.setItem(mark, ids)
      }
   }
}

export const bookmarked_repos = create_marked_repos('bookmarked_repos_ids') // create a singleton by running the function inside this file | https://nodejs.org/docs/latest/api/modules.html#caching
export const hidden_repos = create_marked_repos('repo_id_blacklist')
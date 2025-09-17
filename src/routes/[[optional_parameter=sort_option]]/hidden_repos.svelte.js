import { local_storage as ls } from '$lib/local_storage.js'

const create_hidden_repos = () => {
   let ids = $state([])

   return {
      get ids() { return ids },
      load_from_local_storage: () => ids = ls.getItem('repo_id_blacklist') || [], // to be run at client init hook: https://svelte.dev/docs/kit/hooks#Shared-hooks-init
      hide_repo: repo_id => {
         ids = [...ids, repo_id]
         ls.setItem('repo_id_blacklist', ids)
      },
      unhide_repo: repo_id => {
         ids = ids.filter(id => id != repo_id)
         ls.setItem('repo_id_blacklist', ids)
      }
   }
}

export const hidden_repos = create_hidden_repos() // create a singleton by running the function inside this file | https://nodejs.org/docs/latest/api/modules.html#caching
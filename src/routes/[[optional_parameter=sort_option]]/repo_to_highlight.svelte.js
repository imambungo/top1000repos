import { bookmarked_repos, hidden_repos } from "./marked_repos.svelte.js"
import { repos } from "./repos.svelte.js"

import { page } from '$app/state' // https://svelte.dev/docs/kit/$app-state#page
import { browser } from '$app/environment' // https://svelte.dev/docs/kit/$app-environment

const create_repo_to_highlight = () => { // for delayed scroll. the browser will not scroll if the content is rendered late.
   let url_hash = $derived.by(() => {
      if (browser) {
         if (page.url.hash) {
            return page.url.hash.substring(1) // remove the '#' at the beginning | https://stackoverflow.com/a/6682514/9157799
         } else {
            return ''
         }
      } else {
         return ''
      }
   })
   let already_highlighted = $state(false) // false only for the first url_hash because only the first url_hash need to wait for the content to be rendered.
   let is_rendered = $derived(repos.actually_shown.find((repo) => repo.full_name == url_hash))
   let exist = $derived(repos.all.find((repo) => repo.full_name == url_hash) ? true : false)

   return {
      get url_hash() { return url_hash },
      set url_hash(string) { url_hash = string },
      get is_rendered() { return is_rendered },
      get already_highlighted() { return already_highlighted },
      set already_highlighted(boolean) { already_highlighted = boolean },
      get exist() { return exist },
      get is_bookmarked() {
         if (!exist) return false // fix bug when repo is not found, below `repo.id` will cause error. is_bookmarked is only used to determine whether to switch tab or not, so it's okay to return false.
         const repo = repos.all.find((repo) => repo.full_name == url_hash)
         if (bookmarked_repos.ids.includes(repo.id))
            return true
         else
            return false
      },
      get is_hidden() {
         if (!exist) return false
         const repo = repos.all.find((repo) => repo.full_name == url_hash)
         if (hidden_repos.ids.includes(repo.id))
            return true
         else
            return false
      }
   }
}

export const repo_to_highlight = create_repo_to_highlight()
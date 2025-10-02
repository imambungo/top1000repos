import { hidden_repos } from "./hidden_repos.svelte.js"
import { repos } from "./repos.svelte.js"

const create_repo_to_highlight = () => { // for delayed scroll. the browser will not scroll if the content is rendered late.
   let url_hash = $state('')
   let already_highlighted = $state(false) // false only for the first url_hash because only the first url_hash need to wait for the content to be rendered.
   let already_rendered = $derived(repos.actually_shown.find((repo) => repo.full_name == url_hash))
   let exist = $derived(repos.all.find((repo) => repo.full_name == url_hash) ? true : false)

   return {
      get url_hash() { return url_hash },
      set url_hash(string) { url_hash = string },
      get already_rendered() { return already_rendered },
      get already_highlighted() { return already_highlighted },
      set already_highlighted(boolean) { already_highlighted = boolean },
      init: () => { // to be run at init hook: https://svelte.dev/docs/kit/hooks#Shared-hooks-init
         if (window.location.hash) { // https://stackoverflow.com/a/6682514/9157799
            url_hash = window.location.hash.substring(1)
         }
      },
      get exist() { return exist },
      get is_hidden() {
         const repo = repos.all.find((repo) => repo.full_name == url_hash)
         if (!repo) return false // fix bug when repo is not found, below `repo.id` will cause error. is_hidden is only used to determine whether to switch tab or not.
         if (hidden_repos.ids.includes(repo.id))
            return true
         else
            return false
      }
   }
}

export const repo_to_highlight = create_repo_to_highlight()
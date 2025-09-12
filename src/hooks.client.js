// https://svelte.dev/docs/kit/hooks

import { emoji_image_urls } from "./routes/[[optional_parameter=sort_option]]/emoji_image_urls.svelte.js"
import { excluded_topics } from "./routes/[[optional_parameter=sort_option]]/excluded_topics.svelte.js"
import { hidden_repos } from "./routes/[[optional_parameter=sort_option]]/hidden_repos.svelte.js"
import { repos } from "./routes/[[optional_parameter=sort_option]]/repos.svelte.js"

export const init = async () => { // https://svelte.dev/docs/kit/hooks#Shared-hooks-init
   await emoji_image_urls.fetch_urls()
   excluded_topics.load_from_session_storage()
   await hidden_repos.load_from_local_storage()
   await repos.fetch()
}
// https://svelte.dev/docs/kit/hooks

import { emoji_image_urls } from "./routes/[[optional_parameter=sort_option]]/emoji_image_urls.svelte.js"
import { excluded_topics } from "./routes/[[optional_parameter=sort_option]]/excluded_topics.svelte.js"
import { bookmarked_repos, hidden_repos } from "./routes/[[optional_parameter=sort_option]]/marked_repos.svelte.js"
import { repos } from "./routes/[[optional_parameter=sort_option]]/repos.svelte.js"

import { send_report_if_recurring_user } from "./lib/analytics.js"

export const init = async () => { // https://svelte.dev/docs/kit/hooks#Shared-hooks-init
   emoji_image_urls.fetch_urls() // don't use await or <LoadingAnimation/> won't run
   excluded_topics.load_from_session_storage()
   bookmarked_repos.load_from_local_storage()
   hidden_repos.load_from_local_storage()
   repos.fetch() // don't use await or <LoadingAnimation/> won't run
   send_report_if_recurring_user() // don't use await or <LoadingAnimation/> won't run
}
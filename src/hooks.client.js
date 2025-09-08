// https://svelte.dev/docs/kit/hooks

import { emoji_image_urls } from "./routes/[[optional_parameter=sort_option]]/emoji_image_urls.svelte"
import { excluded_topics } from "./routes/[[optional_parameter=sort_option]]/excluded_topics.svelte"

export const init = async () => { // https://svelte.dev/docs/kit/hooks#Shared-hooks-init
   await emoji_image_urls.fetch_urls()
   excluded_topics.load_from_session_storage()
}
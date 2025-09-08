// https://svelte.dev/docs/kit/hooks

import { emoji_image_urls } from "./routes/[[optional_parameter=sort_option]]/emoji_image_urls.svelte"

export const init = async () => { // https://svelte.dev/docs/kit/hooks#Shared-hooks-init
   await emoji_image_urls.fetch_urls()
}
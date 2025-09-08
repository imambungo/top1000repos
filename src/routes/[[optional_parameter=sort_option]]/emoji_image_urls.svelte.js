const create_emoji_image_urls = () => {
   let emoji_image_urls = $state({})

   return {
      get urls() { return emoji_image_urls },
      fetch_urls: async () => { // this will be run at init hook: https://svelte.dev/docs/kit/hooks#Shared-hooks-init
         const response = await fetch('https://api.github.com/emojis')
         emoji_image_urls = await response.json()
      }
   }
}

export const emoji_image_urls = create_emoji_image_urls() // create a singleton by running the function inside this file | https://nodejs.org/docs/latest/api/modules.html#caching
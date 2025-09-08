import {
   session_storage as ss
} from '$lib/local_storage.js'

const create_excluded_topics = () => {
   let excluded_topics = $state([])

   return {
      get topics() { return excluded_topics },
      load_from_session_storage: () => excluded_topics = ss.getItem('excluded_topics') || [], // to be run at init hook: https://svelte.dev/docs/kit/hooks#Shared-hooks-init
      toggle: (event) => {
         const topic = event.target.innerText // https://stackoverflow.com/a/68455563/9157799
         if (!excluded_topics.includes(topic)) { // if topic not excluded yet, add to excluded_topics
            excluded_topics = [...excluded_topics, topic] // https://svelte.dev/tutorial/updating-arrays-and-objects
         } else { // if already excluded, remove from excluded_topics
            excluded_topics = excluded_topics.filter(t => t !== topic) // https://stackoverflow.com/a/44433050/9157799
         }
         ss.setItem('excluded_topics', excluded_topics)
      }
   }
}

export const excluded_topics = create_excluded_topics() // a singleton: https://nodejs.org/docs/latest/api/modules.html#caching
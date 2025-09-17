import { local_storage as ls } from '$lib/local_storage.js'

import { PUBLIC_BACKEND_URL } from '$env/static/public' // https://svelte.dev/docs/kit/$env-static-public

const send_report = async (message) => { // https://grugbrain.dev/#grug-on-logging
   await fetch(`${PUBLIC_BACKEND_URL}/send-report?${new URLSearchParams({ message })}`, { // bingbot can't or won't do POST | URLSearchParams: https://stackoverflow.com/a/58437909/9157799
      //body: JSON.stringify({ message }), // GET request can but can't have body: https://stackoverflow.com/a/69230317/9157799
      keepalive: true // https://stackoverflow.com/a/76647328/9157799
   })
}

export const send_report_if_recurring_user = async () => { // to be run at init hook: https://svelte.dev/docs/kit/hooks#Shared-hooks-init
   const userAgent = navigator.userAgent // window or navigator is not found at server side
   if (!userAgent.includes('Googlebot') && !userAgent.includes('bingbot') && !userAgent.includes('AhrefsBot')) {
      const time_of_first_visit = ls.getItem('time_of_first_visit') || new Date().toLocaleString('sv-SE', {timeZone: 'Asia/Jakarta'}).slice(0, 16) // https://stackoverflow.com/a/58633651/9157799
      ls.setItem('time_of_first_visit', time_of_first_visit)

      let visit_count
      if (ls.getItem('visit_count'))
         visit_count = ls.getItem('visit_count') + 1
      else
         visit_count = 1
      ls.setItem('visit_count', visit_count)

      let message = `${time_of_first_visit} ${visit_count}`
      if (userAgent.toLowerCase().includes('mobi')) message += ' M'
      if (document.referrer) message += ` ${document.referrer}` // document.referrer: https://stackoverflow.com/a/6856725/9157799
      if (window.location.hash) message += ` ${window.location.hash}`

      let last_visit_date
      if (ls.getItem('last_visit_date'))
         last_visit_date = ls.getItem('last_visit_date')
      else
         last_visit_date = 'never'

      const today = new Date().toLocaleString('sv-SE', {timeZone: 'Asia/Jakarta'}).slice(0, 10) // https://stackoverflow.com/a/58633651/9157799

      if (window.location.hash && last_visit_date != today)
         await send_report(message)
      else if (visit_count >= 5 && last_visit_date != today)
         await send_report(message)

      ls.setItem('last_visit_date', today)
   }
}
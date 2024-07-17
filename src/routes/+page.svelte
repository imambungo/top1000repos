<script>
   import MedScreenStickyOptions from './MedScreenStickyOptions.svelte'
   import NumberingOption from './NumberingOption.svelte';
   import SortOption from './SortOption.svelte'
   import ExcludedTopicsOption from './ExcludedTopicsOption.svelte';
   import Top5OpenIssueThumbsUp from './Top5OpenIssueThumbsUp.svelte'
   import NumOfClosedPR from './NumOfClosedPR.svelte'
   import NumOfClosedIssues from './NumOfClosedIssues.svelte'
   import LoadingAnimation from './LoadingAnimation.svelte'
   import Repo from './Repo.svelte';

   import { balancer } from 'svelte-action-balancer' // https://stackoverflow.com/q/34875725/9157799

   import {
      filter_blacklisted_repos_based_on_current_tab,
   } from './repos_filter_functions' // bisa pake .js atau tidak

   import { sort_repos_based_on_sort_option } from './repos_sort_functions'

   import { onMount, tick } from 'svelte'; // https://stackoverflow.com/a/74165772/9157799

   import {
      local_storage as ls,
      session_storage as ss
   } from '$lib/local_storage.js'

   onMount(async () => { // https://stackoverflow.com/a/74165772/9157799
      emoji_image_urls = await fetchEmojiImageUrls()

      userAgent = navigator.userAgent // need to be assigned at onMount because window or navigator is not found at server side
      all_repos = await fetchRepos()
      excluded_topics = ss.getItem('excluded_topics') || []
      repo_id_blacklist = ls.getItem('repo_id_blacklist') || []
      num_of_repos_to_render.increase_gradually({by: 10, until: 1000, every_milliseconds: 100})

      initial_url_hash = window.location.hash.substring(1) // for delayed scroll. the browser will not scroll if the content is rendered late. | https://stackoverflow.com/a/6682514/9157799
      if (initial_url_hash) need_initial_scroll = true

      if (!userAgent.includes('Googlebot') && !userAgent.includes('bingbot') && !userAgent.includes('AhrefsBot')) {
         const time_of_first_visit = ls.getItem('time_of_first_visit') || new Date().toLocaleString('sv-SE', {timeZone: 'Asia/Jakarta'}).slice(0, 16) // https://stackoverflow.com/a/58633651/9157799
         let visit_count = 1
         if (ls.getItem('visit_count')) visit_count = ls.getItem('visit_count') + 1
         await sendReport(`${time_of_first_visit} ${visit_count} ${document.referrer}`) // https://stackoverflow.com/a/6856725/9157799
         ls.setItem('time_of_first_visit', time_of_first_visit)
         ls.setItem('visit_count', visit_count)

         //document.addEventListener("visibilitychange", async () => { // https://stackoverflow.com/a/76647328/9157799 | It is redundant to remove the event listener in onDestroy() as closing the tab will terminate any listeners running within it
         //   if (document.visibilityState === "visible") {
         //      //await sendReport(`${time_of_first_visit} in`)
         //   } else {
         //      await sendReport(`${time_of_first_visit} ${visit_count} out`)
         //   }
         //})
      }
   })

   let initial_url_hash = ''
   let need_initial_scroll = false
   const scrollIfNeeded = async (repos) => {
      if (need_initial_scroll) {
         const scrollToHash = (url_hash) => { // https://stackoverflow.com/a/21447965/9157799
            window.location.hash = ''
            window.location.hash = url_hash
         }
         if (repos.find((repo) => repo.full_name == initial_url_hash)) {
            await tick() // if the corresponding repo has rendered
            scrollToHash(initial_url_hash)
            need_initial_scroll = false
         }
      }
   }
   $: {
      let trigger = repos
      scrollIfNeeded(repos)
   }

   import { PUBLIC_BACKEND_URL } from '$env/static/public'; // https://kit.svelte.dev/docs/modules#$env-static-public

   let userAgent // need to be assigned at onMount because window or navigator is not found at server side

   const fetchRepos = async () => {
      try { // Typically we don't need try catch. But when a service is crashed in Railway, now the endpoint is pointing to Railway itself which doesn't allow CORS, which cause the fetch to fail (fetch will not fail if it's just an HTTP error).
         const response = await fetch(`${PUBLIC_BACKEND_URL}/repositories`)
         if (response.ok) { // https://developer.mozilla.org/en-US/docs/Web/API/Response/ok
            const repositories = await response.json()
            return repositories
         } else { // HTTP error 503 Service Unavailable (on cloud provider side): The server is currently unable to handle the request due to a temporary overload or scheduled maintenance
            console.log(response.text()) // https://svelte.dev/examples/await-blocks
            return ['an array with one element']
         }
      } catch (err) { // failed to fetch because of CORS error
         console.log(err)
         return ['an array with one element']
      }
   }

   const sendReport = async (message) => { // https://grugbrain.dev/#grug-on-logging
      await fetch(`${PUBLIC_BACKEND_URL}/send-report?${new URLSearchParams({ message })}`, { // bingbot can't or won't do POST | URLSearchParams: https://stackoverflow.com/a/58437909/9157799
         //body: JSON.stringify({ message }), // GET request can but can't have body: https://stackoverflow.com/a/69230317/9157799
         keepalive: true // https://stackoverflow.com/a/76647328/9157799
      })
   }

   let emoji_image_urls = new Promise( () => {} ) // https://stackoverflow.com/a/70846910/9157799 | https://stackoverflow.com/a/74165772/9157799
   const fetchEmojiImageUrls = async () => {
      const response = await fetch('https://api.github.com/emojis')
      const emoji_image_urls = await response.json()
      return emoji_image_urls
   }

   let all_repos = []
   let filtered_repos = [] // https://stackoverflow.com/q/61105696/9157799#comment108104142_61105696
   let repos = []

   let excluded_topics = []
   const excludeTopicToggle = event => {
      const topic = event.target.innerText // https://stackoverflow.com/a/68455563/9157799
      if (!excluded_topics.includes(topic)) { // if topic not excluded yet, add to excluded_topics
         excluded_topics = [...excluded_topics, topic] // https://svelte.dev/tutorial/updating-arrays-and-objects
         //sendReport(`exclude ${topic}`)
      } else { // if already excluded, remove from excluded_topics
         excluded_topics = excluded_topics.filter(t => t !== topic) // https://stackoverflow.com/a/44433050/9157799
         //sendReport(`include ${topic}`)
      }
      ss.setItem('excluded_topics', excluded_topics)
   }

   let repo_id_blacklist = []
   const blacklistRepo = repo_id => {
      repo_id_blacklist = [...repo_id_blacklist, repo_id]
      ls.setItem('repo_id_blacklist', repo_id_blacklist)
   }
   const removeFromBlackList = repo_id => {
      repo_id_blacklist = repo_id_blacklist.filter(id => id != repo_id)
      ls.setItem('repo_id_blacklist', repo_id_blacklist)
   }

   let option_is_open = false // for mobile view
   let current_tab = 'explore'
   let sort_option = 'stargazers_count'
   let numbering = 'rank'

   const change_sort_option = new_sort_option => {
      //sendReport(`sort: ${sort_option}`) // don't use reactive statement since it will get fired twice on mount
      sort_option = new_sort_option
   }

   const change_numbering = new_numbering => {
      //sendReport(`numbering: ${numbering}`) // don't use reactive statement since it will get fired twice on mount
      numbering = new_numbering
   }

   $: { // a bruteforce hammer solution, but it's fine. what causes the slowness is the rendering
      if (all_repos.length > 1) { // fetchRepos() returns an array of one element if there's an error
         filtered_repos = all_repos
         filtered_repos = sort_repos_based_on_sort_option(filtered_repos, sort_option)
         filtered_repos = filtered_repos.map((repo, index) => ({...repo, rank: index+1}))
         filtered_repos = filter_blacklisted_repos_based_on_current_tab(filtered_repos, repo_id_blacklist, current_tab)
         //filtered_repos = filtered_repos.slice(0, 100)  // for debugging performance problem
      }
   }

   import { num_of_repos_to_render } from './num_of_repos_to_render_store.js'
   $num_of_repos_to_render = 50
   $: repos = filtered_repos.slice(0, $num_of_repos_to_render)
   
   $: {
      let trigger = current_tab
      let another_trigger = sort_option
      $num_of_repos_to_render = 50
      num_of_repos_to_render.increase_gradually({by: 10, until: 1000, every_milliseconds: 100})
   }

   const get_how_many_repos_in_id_list = (all_repos, repo_id_list) => {
      let count = 0
      all_repos.forEach(repo => {
         if (repo_id_list.includes(repo.id))
            count++
      })
      return count
   }
   $: blacklist_tab_repos_count = get_how_many_repos_in_id_list(all_repos, repo_id_blacklist) // don't just use repo_id_blacklist.length because when a blacklisted repo is no longer in top 1000, it still get counted
   $: explore_tab_repos_count = 1000 - blacklist_tab_repos_count

   const get_excluded_repos_count = (repos, excluded_topics) => {
      let count = 0
      repos.forEach(repo => {
         if (repo.topics.some(topic => excluded_topics.includes(topic))) // if one of the repo topic is in excluded_topics | https://stackoverflow.com/q/16312528/9157799
            count++
      })
      return count
   }
   $: excluded_repos_count = get_excluded_repos_count(filtered_repos, excluded_topics)

   let visible_chain_link_index = -1
   const setVisibleChainLinkIndex = (index) => visible_chain_link_index = index
</script>

<svelte:head>
   <title>Top GitHub repositories ranking browser | Top 1000 Repos</title>
   <meta name="description" content="Browse the top 1000 GitHub repositories based on stars, pull requests, and issues. Hide repos that you don't need. See the top pull requests and issues closed in the last 12 months of each repository.">
   <link rel="canonical" href="https://top1000repos.com/">
</svelte:head>

<div class='min-h-screen flex flex-col   pl-[calc(100vw-100%)]' data-nosnippet> <!-- min-height and flex (combined with "grow" main) to keep footer at the bottom | https://stackoverflow.com/a/30293718/9157799 padding left for case when there's few item in blacklist (no scrollbar) | data-nosnippet: https://stackoverflow.com/a/72508996/9157799 -->
   <header class='p-4 mb-4 flex flex-col gap-3 items-center lg:max-w-5xl lg:mx-auto w-full'>
      <div class='flex justify-between w-full'> <!-- website name and social media links -->
         <p class='text-lg font-semibold text-slate-700'>Top 1000 Repos</p>
         <div class='flex gap-3 justify-center text-slate-600 decoration-slate-300 text-xs font-medium items-center mt-1'>
            <a class='underline' target='_blank' href='https://twitter.com/top1000repos'>Twitter</a>
            <a class='underline' target='_blank' href='https://github.com/imambungo/top1000repos'>GitHub</a>
         </div>
      </div>
      <div class='my-4 flex flex-col items-center gap-3 w-full'> <!-- header 1 and header text -->
         <h1 class='mt-3 text-2xl font-semibold text-slate-800 text-center w-full' use:balancer={{ ratio: 0.60 }}> <!-- https://stackoverflow.com/q/34875725/9157799 -->
            Top GitHub repositories ranking browser
         </h1>
         <p class='text-slate-600 text-center w-full leading-snug' use:balancer={{ ratio: 0.60 }}> <!-- https://stackoverflow.com/q/34875725/9157799 -->
            Browse the top 1000 GitHub repositories based on stars, pull requests, and issues. Hide repos that you don't need, they stay hidden every time you open the page. See the top pull requests and issues closed in the last 12 months of each repository.
         </p>
      </div>
   </header>
   <div class='sticky top-0 z-10 md:hidden'> <!-- navbar and options FOR MOBILE VIEW | sticky need defined position e.g. top-0 -->
      <!-- TAB BUTTON for mobile screen | https://flowbite.com/docs/components/tabs/#tabs-with-underline -->
      <nav class="text-xs sm:text-sm font-medium text-center border-b border-gray-200 sticky top-0 z-10 bg-white flex flex-wrap pr-4 sm:pr-5 pl-2 sm:pl-3">
         <ul class="pt-1 sm:pt-0 flex flex-wrap -mb-px">
            <li class="mr-2">
               {#if current_tab == 'explore'}
                  <a href="#" class="inline-block p-4 border-b-2 text-gray-700 border-blue-500" aria-current="page">Browse ({explore_tab_repos_count})</a>
               {:else}
                  <a href="#" class="inline-block p-4 border-b-2 text-gray-500 hover:text-gray-600 hover:border-gray-300" on:click={() => current_tab = 'explore'}>Browse ({explore_tab_repos_count})</a>
               {/if}
            </li>
            <li class="mr-2">
               {#if current_tab == 'blacklist'}
                  <a href="#" class="inline-block p-4 border-b-2 text-gray-700 border-blue-500" aria-current="page">Hidden ({blacklist_tab_repos_count})</a>
               {:else}
                  <a href="#" class="inline-block p-4 border-b-2 text-gray-500 hover:text-gray-600 hover:border-gray-300" on:click={() => current_tab = 'blacklist'}>Hidden ({blacklist_tab_repos_count})</a>
               {/if}
            </li>
         </ul>
         <div class='md:hidden grow flex justify-end items-center'>
            <button class='h-7 w-7 relative text-gray-600' on:click={() => option_is_open = !option_is_open}> <!-- https://stackoverflow.com/a/38327984/9157799 -->
               {#if !option_is_open}
                  <svg class='h-6 fill-current absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><defs><style>.cls-1{fill:#fff;opacity:0;}.cls-2{fill:#231f20;}</style></defs><title>options-2</title><g id="Layer_2" data-name="Layer 2"><g id="options-2"><g id="options-2-2" data-name="options-2"><rect class="cls-1" width="24" height="24" transform="translate(24 0) rotate(90)"/><path class="previously-cls-2" d="M19,9a3,3,0,0,0-2.82,2H3a1,1,0,0,0,0,2H16.18A3,3,0,1,0,19,9Z"/><path class="previously-cls-2" d="M3,7H4.18A3,3,0,0,0,9.82,7H21a1,1,0,0,0,0-2H9.82A3,3,0,0,0,4.18,5H3A1,1,0,0,0,3,7Z"/><path class="previously-cls-2" d="M21,17H13.82a3,3,0,0,0-5.64,0H3a1,1,0,0,0,0,2H8.18a3,3,0,0,0,5.64,0H21a1,1,0,0,0,0-2Z"/></g></g></g></svg> <!-- https://icon-icons.com/icon/options/111009 | NOTE: Changed all 3 "cls-2" to "previously-cls-2" to be able to use fill-current : https://youtu.be/ZT5vwF6Ooig?t=107 -->
               {:else}
                  <svg class='h-8 fill-current absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><defs><style>.cls-1{fill:#fff;opacity:0;}.cls-2{fill:#231f20;}</style></defs><title>close</title><g id="Layer_2" data-name="Layer 2"><g id="close"><g id="close-2" data-name="close"><rect class="cls-1" width="24" height="24" transform="translate(24 24) rotate(180)"/><path class="previously-cls-2" d="M13.41,12l4.3-4.29a1,1,0,1,0-1.42-1.42L12,10.59,7.71,6.29A1,1,0,0,0,6.29,7.71L10.59,12l-4.3,4.29a1,1,0,0,0,0,1.42,1,1,0,0,0,1.42,0L12,13.41l4.29,4.3a1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.42Z"/></g></g></g></svg> <!-- https://icon-icons.com/icon/close/111152 | NOTE: Changed the "cls-2" to "previously-cls-2" to be able to use fill-current : https://youtu.be/ZT5vwF6Ooig?t=107 -->
               {/if}
            </button>
         </div>
      </nav>
      {#if option_is_open}
         <!-- OPTIONS (for mobile view) -->
         <div class='text-sm bg-gray-50 py-3 px-4 flex flex-col gap-4 rounded-b drop-shadow overflow-y-auto max-h-[70vh]'>
            <NumberingOption numbering={numbering} handleChange={change_numbering}/>
            <SortOption sort_option={sort_option} handleChange={change_sort_option}/>
            <ExcludedTopicsOption excluded_topics={excluded_topics} excluded_repos_count={excluded_repos_count} excludeTopicToggle={excludeTopicToggle}/>
         </div>
      {/if}
   </div>
   <main class="px-3 sm:px-4 lg:px-5 md:flex md:gap-2 lg:max-w-5xl lg:mx-auto   grow w-full"> <!-- grow to keep footer at the bottom | w-full to grow (cross axis) because parent is flex-col -->
      <!-- OPTIONS (for desktop / md screen size) -->
      <div class='w-1/4 hidden md:block'>
         <MedScreenStickyOptions>
            <NumberingOption numbering={numbering} handleChange={change_numbering}/>
            <SortOption sort_option={sort_option} handleChange={change_sort_option}/>
            <ExcludedTopicsOption excluded_topics={excluded_topics} excluded_repos_count={excluded_repos_count} excludeTopicToggle={excludeTopicToggle}/>
         </MedScreenStickyOptions>
      </div>
      <div class='md:w-3/4'> <!-- browse/hidden navbar & repo list -->
         <!-- TAB BUTTON for md screen | https://flowbite.com/docs/components/tabs/#tabs-with-underline -->
         <nav class="hidden md:block text-sm font-medium text-center border-b border-gray-200 sticky top-0 z-10 bg-white">
            <ul class="flex flex-wrap -mb-px">
               <li class="mr-2">
                  {#if current_tab == 'explore'}
                     <a href="#" class="inline-block p-4 border-b-2 text-gray-700 border-blue-500" aria-current="page">Browse ({explore_tab_repos_count})</a>
                  {:else}
                     <a href="#" class="border-transparent inline-block p-4 border-b-2 text-gray-500 hover:text-gray-600 hover:border-gray-300" on:click={() => current_tab = 'explore'}>Browse ({explore_tab_repos_count})</a>
                  {/if}
               </li>
               <li class="mr-2">
                  {#if current_tab == 'blacklist'}
                     <a href="#" class="inline-block p-4 border-b-2 text-gray-700 border-blue-500" aria-current="page">Hidden ({blacklist_tab_repos_count})</a>
                  {:else}
                     <a href="#" class="border-transparent inline-block p-4 border-b-2 text-gray-500 hover:text-gray-600 hover:border-gray-300" on:click={() => current_tab = 'blacklist'}>Hidden ({blacklist_tab_repos_count})</a>
                  {/if}
               </li>
            </ul>
         </nav>
         <div class='flex flex-col gap-6 py-5' data-nosnippet> <!-- repo list | https://www.google.com/search?q=what+is+data-nosnippet -->
            {#if all_repos.length == 0} <!-- don't use await block since there's reactive variables that depend on all_repos | https://stackoverflow.com/a/66080028/9157799 | https://svelte.dev/tutorial/onmount -->
               {#if !userAgent?.includes('Googlebot')}
                  <LoadingAnimation/>
               {/if}
            {:else if all_repos.length == 1} <!-- fetchRepos() returns an array of one element if there's an error -->
               <p>Can't reach the backend. It maybe crashed or something. Please try again later.</p>
            {:else}
               {#each repos as repo, index (repo.id)} <!-- the key (repo.id) is to fix the performance | https://svelte.dev/docs#template-syntax-each -->
                  <Repo visible_chain_link_index={visible_chain_link_index} setVisibleChainLinkIndex={setVisibleChainLinkIndex} repo={repo} index={index} excluded_topics={excluded_topics} numbering={numbering} current_tab={current_tab} emoji_image_urls={emoji_image_urls} blacklistRepo={blacklistRepo} removeFromBlackList={removeFromBlackList} sendReport={sendReport} excludeTopicToggle={excludeTopicToggle}/>
               {/each}
            {/if}
         </div>
      </div>
   </main>
   <footer class='text-center p-6 text-xs'>
      <p class='mt-2 font-light text-slate-500'>
         <span class='whitespace-nowrap decoration-slate-300'>
            App <a class='underline' target="_blank" href="https://icons8.com/icon/103/star">icon</a> by <a class='underline' target="_blank" href="https://icons8.com">Icons8</a>.
         </span>
         <span class='md:hidden whitespace-nowrap decoration-slate-300'>
            Option <a class='underline' target="_blank" href="https://icon-icons.com/icon/options/111009">burger</a> and <a class='underline' target='_blank' href='https://icon-icons.com/icon/close/111152'>close</a> button by <a class='underline' target='_blank' href='https://icon-icons.com/users/2j7Ni9Qgct0HtmWmLGnLj/icon-sets/'>akveo</a>.
         </span>
      </p>
   </footer>
</div>
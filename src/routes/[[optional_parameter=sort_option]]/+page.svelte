<script>
   import AdUnit from './AdUnit.svelte'
   import ExcludedTopicsOption from './ExcludedTopicsOption.svelte'
   import LoadingAnimation from './LoadingAnimation.svelte'
   import MedScreenStickyOptions from './MedScreenStickyOptions.svelte'
   import NumberingOption from './NumberingOption.svelte'
   import Repo from './Repo.svelte'
   import SortOption from './SortOption.svelte'

   import { balancer } from 'svelte-action-balancer' // https://stackoverflow.com/q/34875725/9157799

   import { untrack } from 'svelte' // https://stackoverflow.com/a/74165772/9157799

   import { page } from '$app/state' // https://stackoverflow.com/a/68578884/9157799

   import { current_tab } from './current_tab.svelte.js'
   import { excluded_topics } from './excluded_topics.svelte.js'
   import { hidden_repos } from './hidden_repos.svelte.js'
   import { num_of_repos_to_render } from './num_of_repos_to_render.svelte.js'
   import { repos } from './repos.svelte.js'
   import { repo_to_highlight } from './repo_to_highlight.svelte.js'
   import { sort_option } from './sort_option.svelte.js'

   if (page.url.pathname.includes('pr')) sort_option.option = 'total_thumbs_up_of_top_5_closed_pr_since_1_year' // https://stackoverflow.com/a/68578884/9157799
   if (page.url.pathname.includes('issues')) sort_option.option = 'total_thumbs_up_of_top_5_closed_issues_since_1_year'
   if (repo_to_highlight.url_hash && repo_to_highlight.is_hidden) current_tab.tab = 'blacklist'
   num_of_repos_to_render.value = 50
   num_of_repos_to_render.increase_gradually({by: 10, until: 1000, every_milliseconds: 80})

   $effect(() => {
      const shown = repos.actually_shown.find((repo) => repo.full_name == repo_to_highlight.url_hash)
      if (shown && untrack(() => !repo_to_highlight.already_highlighted)) {
         untrack(() => { // https://svelte.dev/docs/svelte/svelte#untrack
            repo_to_highlight.already_highlighted = true

            const scroll = () => {
               const scroll_to_hash = (url_hash) => { // https://stackoverflow.com/a/21447965/9157799
                  window.location.hash = ''
                  window.location.hash = url_hash // don't need to add '#' back
               }
               scroll_to_hash(repo_to_highlight.url_hash)

               const disable_scroll = () => { // https://stackoverflow.com/a/26186979/9157799
                  let x = window.scrollX
                  let y = window.scrollY
                  window.onscroll = () => window.scrollTo(x, y)
               }
               disable_scroll()

               const enable_scroll = () => window.onscroll = null // https://stackoverflow.com/q/4770025/9157799#comment117243053_26186979
               setTimeout(enable_scroll, 1000)
            }
            scroll()
         })
      }
   })

   let option_is_open = $state(false) // for mobile view
   let numbering = $state('rank')

   const change_numbering = new_numbering => {
      numbering = new_numbering
   }

   const get_how_many_repos_in_id_list = (repos, repo_id_list) => {
      let count = 0
      repos.forEach(repo => {
         if (repo_id_list.includes(repo.id))
            count++
      })
      return count
   }

   const get_excluded_repos_count = (repos, excluded_topics) => {
      let count = 0
      repos.forEach(repo => {
         if (repo.topics.some(topic => excluded_topics.includes(topic))) // if one of the repo topic is in excluded_topics | https://stackoverflow.com/q/16312528/9157799
            count++
      })
      return count
   }

   let visible_chain_link_index = $state(-1)
   const setVisibleChainLinkIndex = (index) => visible_chain_link_index = index

   let hidden_tab_repos_count = $derived(get_how_many_repos_in_id_list(repos.all, hidden_repos.ids)) // don't just use hidden_repos.ids.length because when a hidden repo is no longer in top 1000, it still get counted
   let explore_tab_repos_count = $derived(1000 - hidden_tab_repos_count)
   let excluded_repos_count = $derived(get_excluded_repos_count(repos.to_show, excluded_topics.topics))
</script>

<svelte:head>
   {#if page.url.pathname.includes('pr')}
      <title>Top 1000 GitHub Repositories Sorted by Pull Requests</title>
      <link rel="canonical" href="https://top1000repos.com/sorted-by-pr">
   {:else if page.url.pathname.includes('issues')}
      <title>Top 1000 GitHub Repositories Sorted by Closed Issues</title>
      <link rel="canonical" href="https://top1000repos.com/sorted-by-issues">
   {:else}
      <title>Top 1000 GitHub repositories, updated daily, all on one page.</title>
      <link rel="canonical" href="https://top1000repos.com">
   {/if}
   <meta name="description" content="Browse the top 1000 GitHub repositories. Sort them by stars, pull requests, and issues. Hide repos you don't need. See the top pull requests and issues closed in the last 12 months of each repository.">
</svelte:head>

<div class='min-h-screen flex flex-col   pl-[calc(100vw-100%)]' data-nosnippet> <!-- min-height and flex (combined with "grow" main) to keep footer at the bottom | https://stackoverflow.com/a/30293718/9157799 padding left for case when there's few item in hidden tab (no scrollbar) | data-nosnippet: https://stackoverflow.com/a/72508996/9157799 -->
   <header class='p-4 mb-4 flex flex-col gap-3 items-center lg:max-w-5xl lg:mx-auto w-full'>
      <div class='flex justify-between w-full'> <!-- website name and social media links -->
         <p class='text-lg font-semibold text-slate-700'>Top 1000 Repos</p>
         <div class='flex gap-3 justify-center text-slate-600 decoration-slate-300 text-xs font-medium items-center mt-1'>
            <a class='underline' target='_blank' href='https://github.com/imambungo/top1000repos'>GitHub</a>
            <!-- <a class='underline' target='_blank' href='https://twitter.com/top1000repos'>Twitter</a> -->
         </div>
      </div>
      <div class='my-4 flex flex-col items-center gap-3 w-full'> <!-- header 1 and header text -->
         <h1 class='mt-3 text-2xl font-semibold text-slate-800 text-center w-full' use:balancer={{ ratio: 0.60 }}> <!-- https://stackoverflow.com/q/34875725/9157799 -->
            Top GitHub Repositories Ranking Browser
         </h1>
         <p class='text-slate-600 text-center w-full leading-snug' use:balancer={{ ratio: 0.60 }}> <!-- https://stackoverflow.com/q/34875725/9157799 -->
            Browse the top 1000 GitHub repositories. Sort them by stars, pull requests, and issues. Hide repos you don't need, they stay hidden every time you open the page. See the top pull requests and issues closed in the last 12 months of each repository.
         </p>
      </div>
   </header>
   <div class='sticky top-0 z-10 md:hidden'> <!-- navbar and options FOR MOBILE VIEW | sticky need defined position e.g. top-0 -->
      <!-- TAB BUTTON for mobile screen | https://flowbite.com/docs/components/tabs/#tabs-with-underline -->
      <nav class="text-xs sm:text-sm font-medium text-center border-b border-gray-200 sticky top-0 z-10 bg-white flex flex-wrap pr-4 sm:pr-5 pl-2 sm:pl-3">
         <ul class="pt-1 sm:pt-0 flex flex-wrap -mb-px">
            <li class="mr-2">
               {#if current_tab.tab == 'explore'}
                  <a href="#" class="inline-block p-4 border-b-2 text-gray-700 border-blue-500" aria-current="page">Browse ({explore_tab_repos_count})</a>
               {:else}
                  <a href="#" class="inline-block p-4 border-b-2 text-gray-500 hover:text-gray-600 hover:border-gray-300" onclick={() => current_tab.tab = 'explore'}>Browse ({explore_tab_repos_count})</a>
               {/if}
            </li>
            <li class="mr-2">
               {#if current_tab.tab == 'blacklist'}
                  <a href="#" class="inline-block p-4 border-b-2 text-gray-700 border-blue-500" aria-current="page">Hidden ({hidden_tab_repos_count})</a>
               {:else}
                  <a href="#" class="inline-block p-4 border-b-2 text-gray-500 hover:text-gray-600 hover:border-gray-300" onclick={() => current_tab.tab = 'blacklist'}>Hidden ({hidden_tab_repos_count})</a>
               {/if}
            </li>
         </ul>
         <div class='md:hidden grow flex justify-end items-center'>
            <button class='h-7 w-7 relative text-gray-600' onclick={() => option_is_open = !option_is_open}> <!-- https://stackoverflow.com/a/38327984/9157799 -->
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
            <SortOption sort_option={sort_option}/>
            <NumberingOption numbering={numbering} handleChange={change_numbering}/>
            <ExcludedTopicsOption excluded_topics={excluded_topics} excluded_repos_count={excluded_repos_count}/>
         </div>
      {/if}
   </div>
   <main class="px-3 sm:px-4 lg:px-5 md:flex md:gap-2 lg:max-w-5xl lg:mx-auto   grow w-full"> <!-- grow to keep footer at the bottom | w-full to grow (cross axis) because parent is flex-col -->
      <!-- OPTIONS (for desktop / md screen size) -->
      <div class='w-1/4 hidden md:block'>
         <MedScreenStickyOptions>
            <SortOption sort_option={sort_option}/>
            <NumberingOption numbering={numbering} handleChange={change_numbering}/>
            <ExcludedTopicsOption excluded_topics={excluded_topics} excluded_repos_count={excluded_repos_count}/>
            <AdUnit/>
         </MedScreenStickyOptions>
      </div>
      <div class='md:w-3/4'> <!-- browse/hidden navbar & repo list -->
         <!-- TAB BUTTON for md screen | https://flowbite.com/docs/components/tabs/#tabs-with-underline -->
         <nav class="hidden md:block text-sm font-medium text-center border-b border-gray-200 sticky top-0 z-10 bg-white">
            <ul class="flex flex-wrap -mb-px">
               <li class="mr-2">
                  {#if current_tab.tab == 'explore'}
                     <a href="#" class="inline-block p-4 border-b-2 text-gray-700 border-blue-500" aria-current="page">Browse ({explore_tab_repos_count})</a>
                  {:else}
                     <a href="#" class="border-transparent inline-block p-4 border-b-2 text-gray-500 hover:text-gray-600 hover:border-gray-300" onclick={() => current_tab.tab = 'explore'}>Browse ({explore_tab_repos_count})</a>
                  {/if}
               </li>
               <li class="mr-2">
                  {#if current_tab.tab == 'blacklist'}
                     <a href="#" class="inline-block p-4 border-b-2 text-gray-700 border-blue-500" aria-current="page">Hidden ({hidden_tab_repos_count})</a>
                  {:else}
                     <a href="#" class="border-transparent inline-block p-4 border-b-2 text-gray-500 hover:text-gray-600 hover:border-gray-300" onclick={() => current_tab.tab = 'blacklist'}>Hidden ({hidden_tab_repos_count})</a>
                  {/if}
               </li>
            </ul>
         </nav>
         <div class='flex flex-col gap-6 py-5' data-nosnippet> <!-- repo list | https://www.google.com/search?q=what+is+data-nosnippet -->
            {#if repos.all.length == 0} <!-- don't use await block since there's derived state that depend on repos.all | https://stackoverflow.com/a/66080028/9157799 | https://svelte.dev/tutorial/onmount -->
               <LoadingAnimation/>
            {:else if repos.all.length == 1} <!-- fetchRepos() returns an array of one element if there's an error -->
               <p>Can't reach the backend. It maybe crashed or something. Please try again later.</p>
            {:else}
               {#each repos.actually_shown as repo, index (repo.id)} <!-- the key (repo.id) is to fix the performance | https://svelte.dev/docs#template-syntax-each -->
                  <Repo visible_chain_link_index={visible_chain_link_index} setVisibleChainLinkIndex={setVisibleChainLinkIndex} repo={repo} index={index} excluded_topics={excluded_topics} numbering={numbering} current_tab={current_tab} hidden_repos={hidden_repos} repo_to_highlight={repo_to_highlight}/>
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
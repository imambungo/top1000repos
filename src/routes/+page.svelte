<script>
   import MedScreenStickyOptions from './MedScreenStickyOptions.svelte'
   import NumberingOption from './NumberingOption.svelte';
   import ExcludedTopicsOption from './ExcludedTopicsOption.svelte';
   import StargazersCount from './StargazersCount.svelte'
   import LastCommitDate from './LastCommitDate.svelte'
   import Top5ClosedPRThumbsUp from './Top5ClosedPRThumbsUp.svelte'
   import Top5ClosedIssuesThumbsUp from './Top5ClosedIssuesThumbsUp.svelte'
   import Top5OpenIssueThumbsUp from './Top5OpenIssueThumbsUp.svelte'
   import Description from './Description.svelte'
   import Number from './Number.svelte'
   import NumOfClosedPR from './NumOfClosedPR.svelte'
   import NumOfClosedIssues from './NumOfClosedIssues.svelte'
   import LoadingAnimation from './LoadingAnimation.svelte'

   import {
      filter_blacklisted_repos_based_on_current_tab,
   } from './repos_filter_functions' // bisa pake .js atau tidak

   import { sort_repos_based_on_sort_option } from './repos_sort_functions'

   import { onMount } from 'svelte'; // https://stackoverflow.com/a/74165772/9157799

   import {
      local_storage as ls,
      session_storage as ss
   } from '$lib/local_storage.js'

   onMount(async () => { // https://stackoverflow.com/a/74165772/9157799
      emoji_image_urls = await fetchEmojiImageUrls()
      all_repos = await fetchRepos()
      all_repos = sort_repos_based_on_sort_option(all_repos, sort_option)
      all_repos = all_repos.map((repo, index) => ({...repo, rank: index+1}))
      excluded_topics = ss.getItem('excluded_topics') || []
      repo_id_blacklist = ls.getItem('repo_id_blacklist') || []
   })

   import { PUBLIC_BACKEND_URL } from '$env/static/public'; // https://kit.svelte.dev/docs/modules#$env-static-public

   const fetchRepos = async () => {
      const response = await fetch(`${PUBLIC_BACKEND_URL}/repositories`)
      const repositories = await response.json()
      return repositories
   }

   let emoji_image_urls = new Promise( () => {} ) // https://stackoverflow.com/a/70846910/9157799 | https://stackoverflow.com/a/74165772/9157799
   const fetchEmojiImageUrls = async () => {
      const response = await fetch('https://api.github.com/emojis')
      const emoji_image_urls = await response.json()
      return emoji_image_urls
   }

   let all_repos = []
   let repos = [] // https://stackoverflow.com/q/61105696/9157799#comment108104142_61105696

   let excluded_topics = []
   const excludeTopicToggle = event => {
      const topic = event.target.innerText // https://stackoverflow.com/a/68455563/9157799
      if (!excluded_topics.includes(topic)) // if topic not excluded yet, add to excluded_topics
         excluded_topics = [...excluded_topics, topic] // https://svelte.dev/tutorial/updating-arrays-and-objects
      else // if already excluded, remove from excluded_topics
         excluded_topics = excluded_topics.filter(t => t !== topic) // https://stackoverflow.com/a/44433050/9157799
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

   $: { // a bruteforce hammer solution, but it's fine. what causes the slowness is the rendering
      repos = all_repos
      repos = filter_blacklisted_repos_based_on_current_tab(repos, repo_id_blacklist, current_tab)
      repos = sort_repos_based_on_sort_option(repos, sort_option)
      //repos = repos.slice(0, 100)  // for debugging performance problem
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
   $: excluded_repos_count = get_excluded_repos_count(repos, excluded_topics)
</script>

<svelte:head>
   <title>Top 1000 Repos - An unofficial web app to help you explore GitHub's top 1000 repos</title>
   <meta name="description" content="GitHub's top 1000 repositories, all in one page. Blacklist the ones you're not interested in.">
   <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2099788966207457" crossorigin="anonymous"></script> <!-- https://www.google.com/adsense -->
</svelte:head>

<div class='pl-[calc(100vw-100%)]'> <!-- https://stackoverflow.com/a/30293718/9157799 for case when there's few item in blacklist (no scrollbar) -->
   <header class='px-4 py-8 lg:max-w-5xl lg:mx-auto text-center flex flex-col gap-2'>
      <h1 class='text-3xl font-semibold text-slate-800'>Top 1000 Repos</h1>
      <p class='text-lg text-slate-700'>An unofficial web app to explore GitHub's top 1000 repositories</p>
   </header>
   <div class='px-4 py-8 lg:max-w-5xl lg:mx-auto text-center flex flex-col gap-2'>
      <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2099788966207457" crossorigin="anonymous"></script>
      <!-- display ads? -->
      <ins class="adsbygoogle"
         style="display:block"
         data-ad-client="ca-pub-2099788966207457"
         data-ad-slot="5508607230"
         data-ad-format="auto"
         data-full-width-responsive="true"></ins>
      <script>
         (adsbygoogle = window.adsbygoogle || []).push({});
      </script>
   </div>
   <div class='sticky top-0 z-10 md:hidden'> <!-- navbar and options for mobile view | sticky need defined position e.g. top-0 -->
      <nav class="text-xs sm:text-sm font-medium text-center border-b border-gray-200 sticky top-0 z-10 bg-white flex flex-wrap pr-4 sm:pr-5 pl-2 sm:pl-3"> <!-- TAB BUTTON for mobile screen | https://flowbite.com/docs/components/tabs/#tabs-with-underline -->
         <ul class="pt-1 sm:pt-0 flex flex-wrap -mb-px">
            <li class="mr-2">
               {#if current_tab == 'explore'}
                  <a href="#" class="inline-block p-4 border-b-2 text-gray-700 border-blue-500" aria-current="page">Explore ({explore_tab_repos_count})</a>
               {:else}
                  <a href="#" class="inline-block p-4 border-b-2 text-gray-500 hover:text-gray-600 hover:border-gray-300" on:click={() => current_tab = 'explore'}>Explore ({explore_tab_repos_count})</a>
               {/if}
            </li>
            <li class="mr-2">
               {#if current_tab == 'blacklist'}
                  <a href="#" class="inline-block p-4 border-b-2 text-gray-700 border-blue-500" aria-current="page">Blacklist ({blacklist_tab_repos_count})</a>
               {:else}
                  <a href="#" class="inline-block p-4 border-b-2 text-gray-500 hover:text-gray-600 hover:border-gray-300" on:click={() => current_tab = 'blacklist'}>Blacklist ({blacklist_tab_repos_count})</a>
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
         <div class='text-sm bg-gray-50 py-3 px-4 flex flex-col gap-4 rounded-b drop-shadow overflow-y-auto max-h-[70vh]'> <!-- OPTIONS (for mobile view) -->
            <NumberingOption numbering={numbering} handleChange={newNumbering => numbering = newNumbering}/>
            <ExcludedTopicsOption excluded_topics={excluded_topics} excluded_repos_count={excluded_repos_count} excludeTopicToggle={excludeTopicToggle}/>
         </div>
      {/if}
   </div>
   <main class="px-3 sm:px-4 lg:px-5 md:flex md:gap-2 lg:max-w-5xl lg:mx-auto">
      <div class='w-1/4 hidden md:block'> <!-- OPTIONS (for desktop / md screen size) -->
         <MedScreenStickyOptions>
            <NumberingOption numbering={numbering} handleChange={newNumbering => numbering = newNumbering}/>
            <ExcludedTopicsOption excluded_topics={excluded_topics} excluded_repos_count={excluded_repos_count} excludeTopicToggle={excludeTopicToggle}/>
         </MedScreenStickyOptions>
      </div>
      <div class='md:w-3/4'>
         <nav class="hidden md:block text-sm font-medium text-center border-b border-gray-200 sticky top-0 z-10 bg-white"> <!-- TAB BUTTON for md screen | https://flowbite.com/docs/components/tabs/#tabs-with-underline -->
            <ul class="flex flex-wrap -mb-px">
               <li class="mr-2">
                  {#if current_tab == 'explore'}
                     <a href="#" class="inline-block p-4 border-b-2 text-gray-700 border-blue-500" aria-current="page">Explore ({explore_tab_repos_count})</a>
                  {:else}
                     <a href="#" class="border-transparent inline-block p-4 border-b-2 text-gray-500 hover:text-gray-600 hover:border-gray-300" on:click={() => current_tab = 'explore'}>Explore ({explore_tab_repos_count})</a>
                  {/if}
               </li>
               <li class="mr-2">
                  {#if current_tab == 'blacklist'}
                     <a href="#" class="inline-block p-4 border-b-2 text-gray-700 border-blue-500" aria-current="page">Blacklist ({blacklist_tab_repos_count})</a>
                  {:else}
                     <a href="#" class="border-transparent inline-block p-4 border-b-2 text-gray-500 hover:text-gray-600 hover:border-gray-300" on:click={() => current_tab = 'blacklist'}>Blacklist ({blacklist_tab_repos_count})</a>
                  {/if}
               </li>
            </ul>
         </nav>
         <div class='flex flex-col gap-5 py-5'>
            {#if all_repos.length == 0} <!-- https://stackoverflow.com/a/66080028/9157799 | https://svelte.dev/tutorial/onmount -->
               <LoadingAnimation/>
            {:else}
               {#each repos as repo, index (repo.id)} <!-- the key (repo.id) is to fix the performance | https://svelte.dev/docs#template-syntax-each -->
                  <div class="flex {repo.topics.some(topic => excluded_topics.includes(topic)) && 'opacity-50'} -ml-3"> <!-- dim if topics is in excluded_topics | https://stackoverflow.com/q/16312528/9157799 | use negative margin left because the space before the number is too big -->
                     <Number numbering={numbering} rank={repo.rank} order={index+1}/> <!-- NUMBER -->
                     <div class='grow flex flex-col gap-1 min-w-0'> <!-- the rest | grow against number | https://stackoverflow.com/a/75308868/9157799 -->
                        <div class='flex gap-2'>
                           <div class='min-w-0 whitespace-pre-wrap'> <!-- https://tailwindcss.com/docs/whitespace#pre-wrap -->
                              <a href="{repo.html_url}" class="text-blue-600 break-words">{repo.full_name}</a> <!-- REPO FULL NAME / TITLE -->
                              {#if repo.archived}
                                 <span> </span> <!-- utilizing whitespace-pre-wrap above. it preserve spaces only if they're not in the edges which is nice -->
                                 <span class='rounded-full border-solid px-2 py-1 text-xs text-yellow-600 border border-yellow-600 whitespace-nowrap'>Public archive</span>
                              {/if}
                           </div>
                           <div class='grow flex justify-end items-center'>
                              {#if current_tab == 'explore'}
                                 <button on:click={() => blacklistRepo(repo.id)} class="bg-gray-100 hover:bg-gray-200 border text-gray-700 text-xs py-1 px-3 rounded-md"> <!-- https://stackoverflow.com/q/58262380/9157799 -->
                                    Blacklist
                                 </button>
                              {:else if current_tab == 'blacklist'}
                                 <button on:click={() => removeFromBlackList(repo.id)} class="bg-gray-100 hover:bg-gray-200 border text-gray-700 text-xs py-1 px-3 rounded-md"> <!-- https://stackoverflow.com/q/58262380/9157799 -->
                                    Remove
                                 </button>
                              {/if}
                           </div>
                        </div>
                        <Description promise={emoji_image_urls} description={repo.description}/> <!-- REPO DESCRIPTION -->
                        {#if repo.topics.length > 0} <!-- topics | if clause to prevent parent's flex gap -->
                           <div class="flex flex-wrap gap-1">
                              {#each repo.topics as topic}
                                 <div on:click={excludeTopicToggle} class="cursor-pointer rounded-full bg-sky-100 px-2 py-1 text-xs text-blue-500 {excluded_topics.includes(topic) && 'line-through'}">{topic}</div>
                              {/each}
                           </div>
                        {/if}
                        <div class='flex flex-wrap gap-x-4 text-xs text-gray-600'> <!-- last_commit_date & PRs thumbs up -->
                           <StargazersCount stargazers_count={repo.stargazers_count}/>
                           <Top5ClosedPRThumbsUp total_thumbs_up_of_top_5_closed_pr_since_1_year={repo.total_thumbs_up_of_top_5_closed_pr_since_1_year} html_url={repo.html_url}/>
                           <Top5ClosedIssuesThumbsUp total_thumbs_up_of_top_5_closed_issues_since_1_year={repo.total_thumbs_up_of_top_5_closed_issues_since_1_year} html_url={repo.html_url} has_issues_tab={repo.has_issues}/>
                           <!-- <Top5OpenIssueThumbsUp total_thumbs_up_of_top_5_open_issue_of_all_time={repo.total_thumbs_up_of_top_5_open_issue_of_all_time} html_url={repo.html_url} has_issues_tab={repo.has_issues}/> -->
                           <LastCommitDate last_commit_date={repo.last_commit_date}/>
                        </div>
                     </div>
                  </div>
               {/each}
            {/if}
         </div>
      </div>
   </main>
   {#if all_repos.length != 0} <!-- https://stackoverflow.com/a/66080028/9157799 | https://svelte.dev/tutorial/onmount -->
      <footer class='text-center px-6 py-6 text-xs'>
         <p class='flex gap-3 justify-center text-slate-600 decoration-slate-300 font-medium'>
            <a class='underline' target='_blank' href='https://twitter.com/top1000repos'>Twitter</a>
            <a class='underline' target='_blank' href='mailto:contact@top1000repos.com'>Contact</a>
            <a class='underline'  href='/privacy-policy'>Privacy Policy</a>
         </p>
         <p class='mt-2 font-light text-slate-500'>
            <span class='whitespace-nowrap decoration-slate-300'>
               App <a class='underline' target="_blank" href="https://icons8.com/icon/103/star">icon</a> by <a class='underline' target="_blank" href="https://icons8.com">Icons8</a>.
            </span>
            <span class='md:hidden whitespace-nowrap decoration-slate-300'>
               Option <a class='underline' target="_blank" href="https://icon-icons.com/icon/options/111009">burger</a> and <a class='underline' target='_blank' href='https://icon-icons.com/icon/close/111152'>close</a> button by <a class='underline' target='_blank' href='https://icon-icons.com/users/2j7Ni9Qgct0HtmWmLGnLj/icon-sets/'>akveo</a>.
            </span>
         </p>
      </footer>
   {/if}
</div>
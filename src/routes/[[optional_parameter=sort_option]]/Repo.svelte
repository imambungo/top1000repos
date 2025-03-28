<script>
   import StargazersCount from './StargazersCount.svelte'
   import LastCommitDate from './LastCommitDate.svelte'
   import Top5ClosedPRThumbsUp from './Top5ClosedPRThumbsUp.svelte'
   import Top5ClosedIssuesThumbsUp from './Top5ClosedIssuesThumbsUp.svelte'
   import Description from './Description.svelte'
   import Number from './Number.svelte'
   let {
      visible_chain_link_index,
      setVisibleChainLinkIndex,
      repo,
      index,
      excluded_topics,
      numbering,
      current_tab,
      emoji_image_urls,
      repo_to_highlight,

      blacklistRepo,
      removeFromBlackList,
      sendReport,
      excludeTopicToggle
   } = $props();

   let transition_animation_class = $state('')
   const runCodeWithoutReactiveBlockFootGun = () => {
      if (repo.full_name == repo_to_highlight) {
         transition_animation_class = 'bg-amber-100 duration-500'
         setTimeout(
            () => {
               transition_animation_class = 'duration-[5000ms]'
               setTimeout(
                  () => {
                     transition_animation_class = '' // prevent transition animation when selecting repo topics
                  },
                  5000
               )
            },
            1000
         )
      }
   }
   $effect(() => {
      let trigger = repo_to_highlight
      runCodeWithoutReactiveBlockFootGun() // still a footgun: https://github.com/sveltejs/svelte/issues/9248#issuecomment-1998643597
   })
</script>

<div id="{repo.full_name}" onmouseenter={()=>{setVisibleChainLinkIndex(index)}} onmouseleave={()=>{setVisibleChainLinkIndex(-1)}} ontouchstart={()=>{setVisibleChainLinkIndex(index)}} class="scroll-my-20 flex {transition_animation_class} {repo.topics.some(topic => excluded_topics.includes(topic)) && 'opacity-50'} -ml-3 md:-ml-2"> <!-- dim if topics is in excluded_topics | https://stackoverflow.com/q/16312528/9157799 | use negative margin left because the space before the number is too big | scroll-my: https://stackoverflow.com/a/60975588/9157799 -->
   <div class="text-sm pt-0.5 w-8 shrink-0 mr-2 text-gray-700 flex flex-col items-end md:ml-0"> <!-- number and link-to-scroll | shrink: https://stackoverflow.com/a/45741742/9157799 -->
      <Number numbering={numbering} rank={repo.rank} order={index+1}/>
      <div class='grow flex flex-col justify-end'>
         <a data-sveltekit-replacestate class='mb-1 {visible_chain_link_index == index ? 'opacity-100' : 'opacity-0'} hover:opacity-100' href="#{repo.full_name}"> <!-- chain link | https://stackoverflow.com/a/2835151/9157799 | https://github.com/tailwindlabs/tailwindcss/issues/12130 -->
            <svg class="w-[1.15rem] stroke-gray-700" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <!-- https://tailwindcss.com/docs/stroke -->
               <path d="M13.5442 10.4558C11.8385 8.75022 9.07316 8.75022 7.36753 10.4558L4.27922 13.5442C2.57359 15.2498 2.57359 18.0152 4.27922 19.7208C5.98485 21.4264 8.75021 21.4264 10.4558 19.7208L12 18.1766" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
               <path d="M10.4558 13.5442C12.1614 15.2498 14.9268 15.2498 16.6324 13.5442L19.7207 10.4558C21.4264 8.75021 21.4264 5.98485 19.7207 4.27922C18.0151 2.57359 15.2497 2.57359 13.5441 4.27922L12 5.82338" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
         </a>
      </div>
   </div>
   <div class='grow flex flex-col gap-1 min-w-0'> <!-- the rest | grow against number | https://stackoverflow.com/a/75308868/9157799 -->
      <div class='flex gap-2'>
         <div class='min-w-0 whitespace-pre-wrap'> <!-- repo name & archived sign | https://tailwindcss.com/docs/whitespace#pre-wrap -->
            <!-- REPO FULL NAME / TITLE -->
            <a href="{repo.html_url}" target="_blank" class="text-blue-600 break-words">{repo.full_name}</a>
            <!-- <a href="{repo.html_url}" on:mousedown={sendReport(repo.full_name)} target="_blank" class="text-blue-600 break-words">{repo.full_name}</a> -->   <!-- mousedown: https://stackoverflow.com/a/12365382/9157799 -->
            {#if repo.archived}
               <span> </span> <!-- utilizing whitespace-pre-wrap above. it preserve spaces only if they're not in the edges which is nice -->
               <span class='rounded-full border-solid px-2 py-1 text-xs text-yellow-600 border border-yellow-600 whitespace-nowrap'>Public archive</span>
            {/if}
         </div>
         <div class='grow flex justify-end items-center'> <!-- browse/hide button -->
            {#if current_tab == 'explore'}
               <button onclick={() => {blacklistRepo(repo.id)/*; sendReport(`hide ${repo.full_name}`)*/}} class="bg-gray-100 hover:bg-gray-200 border text-gray-700 text-xs py-1 px-3 rounded-md"> <!-- https://stackoverflow.com/q/58262380/9157799 -->
                  Hide
               </button>
            {:else if current_tab == 'blacklist'}
               <button onclick={() => {removeFromBlackList(repo.id)/*; sendReport(`remove ${repo.full_name}`)*/}} class="bg-gray-100 hover:bg-gray-200 border text-gray-700 text-xs py-1 px-3 rounded-md"> <!-- https://stackoverflow.com/q/58262380/9157799 -->
                  Remove
               </button>
            {/if}
         </div>
      </div>
      <Description promise={emoji_image_urls} description={repo.description}/> <!-- REPO DESCRIPTION -->
      {#if repo.topics.length > 0} <!-- topics | if clause to prevent parent's flex gap -->
         <div class="flex flex-wrap gap-1">
            {#each repo.topics as topic}
               <div onclick={excludeTopicToggle} class="cursor-pointer rounded-full bg-sky-100 px-2 py-1 text-xs text-blue-500 {excluded_topics.includes(topic) && 'line-through'}">{topic}</div>
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
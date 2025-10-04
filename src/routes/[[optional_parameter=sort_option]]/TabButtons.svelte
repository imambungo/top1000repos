<script>
   let { current_tab, repos } = $props()
</script>

<li class="mr-2">
   {#if current_tab.tab == 'explore'}
      <a href="#top" class="inline-block p-4 border-b-2 text-gray-700 border-blue-500" aria-current="page">Browse ({repos.count.explore_tab})</a>
   {:else}
      <a href="#top" class="inline-block p-4 border-b-2 text-gray-500 hover:text-gray-600 hover:border-gray-300" onclick={() => current_tab.tab = 'explore'}>Browse ({repos.count.explore_tab})</a>
   {/if}
</li>
<li class="mr-2">
   {#if current_tab.tab == 'bookmark'}
      <a href="#top" class="inline-block p-4 border-b-2 text-gray-700 border-blue-500" aria-current="page">Bookmark ({repos.count.bookmark_tab})</a>
   {:else}
      <a href="#top" class="inline-block p-4 border-b-2 text-gray-500 hover:text-gray-600 hover:border-gray-300" onclick={() => current_tab.tab = 'bookmark'}>Bookmark ({repos.count.bookmark_tab})</a>
   {/if}
</li>
<li class="mr-2">
   {#if current_tab.tab == 'blacklist'}
      <a href="#top" class="inline-block p-4 border-b-2 text-gray-700 border-blue-500" aria-current="page">Hidden ({repos.count.hidden_tab})</a>
   {:else}
      <a href="#top" class="inline-block p-4 border-b-2 text-gray-500 hover:text-gray-600 hover:border-gray-300" onclick={() => current_tab.tab = 'blacklist'}>Hidden ({repos.count.hidden_tab})</a>
   {/if}
</li>
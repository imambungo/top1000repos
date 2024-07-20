<script>
   export let excludeTopicToggle
   export let excluded_topics
   export let excluded_repos_count
</script>

<div class='flex flex-col gap-1'>
   <p class='text-gray-600 text-xs font-medium'>Excluded topics</p>
   <div>
      <div class="flex flex-wrap gap-1"> <!-- excluded topics -->
         {#each excluded_topics as topic}
            <div on:click={excludeTopicToggle} class="cursor-pointer rounded-full bg-sky-100 px-2 py-1 text-xs text-blue-500">{topic}</div>
         {/each}
      </div>
      <p class='ml-0.5 mt-0.5 text-gray-500 text-xs tracking-tight'>
         {#if excluded_topics.length > 0}
            {excluded_repos_count} {excluded_repos_count == 1 ? 'repo' : 'repos'} dimmed.
         {:else}
            None. Select a repo topic to exclude it.
         {/if}
      </p>
   </div>
</div>
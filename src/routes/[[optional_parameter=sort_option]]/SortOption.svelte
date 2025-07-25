<script>
   let { handleChange, sort_option } = $props()
   const needed_when_switching_from_button_to_a = 'inline-block cursor-default hover:cursor-pointer'
</script>

<div class='flex flex-col gap-1'>
   <p class='text-gray-600 text-xs font-medium'>Sort</p>
   <div class='md:flex md:flex-col lg:block bg-gray-300 rounded-[0.85rem] p-0.5 w-fit font-semibold text-xs text-white'>
      <a data-sveltekit-replacestate href='/' class='{needed_when_switching_from_button_to_a} px-4 py-1 tracking-tight {sort_option == 'stargazers_count' ? 'rounded-full bg-gray-50 text-gray-500 hover:cursor-default' : ''}' onclick={() => handleChange('stargazers_count')}> <!-- https://kit.svelte.dev/docs/link-options#data-sveltekit-replacestate -->
         Stars
      </a>
      <a data-sveltekit-replacestate href='/sorted-by-pr' class='{needed_when_switching_from_button_to_a} px-4 py-1 tracking-tight {sort_option == 'total_thumbs_up_of_top_5_closed_pr_since_1_year' ? 'rounded-full bg-gray-50 text-gray-500 hover:cursor-default' : ''}' onclick={() => handleChange('total_thumbs_up_of_top_5_closed_pr_since_1_year')}>
         PR <span class='drop-shadow-[0_0_0.6px_rgba(0,0,0,0.5)]'>👍</span> <!-- https://stackoverflow.com/a/74753353/9157799 -->
      </a>
      <a data-sveltekit-replacestate href='/sorted-by-issues' class='{needed_when_switching_from_button_to_a} px-4 py-1 tracking-tight {sort_option == 'total_thumbs_up_of_top_5_closed_issues_since_1_year' ? 'rounded-full bg-gray-50 text-gray-500 hover:cursor-default' : ''}' onclick={() => handleChange('total_thumbs_up_of_top_5_closed_issues_since_1_year')}>
         Issues <span class='drop-shadow-[0_0_0.6px_rgba(0,0,0,0.5)]'>👍</span> <!-- https://stackoverflow.com/a/74753353/9157799 -->
      </a>
   </div>
</div>
<script>
   export let handleChange
   export let sort_option
</script>

<div class='flex flex-col gap-1'>
   <p class='text-gray-600 text-xs font-medium'>Sort</p>
   <div class='md:flex md:flex-col lg:block bg-gray-300 rounded-[0.85rem] p-0.5 w-fit font-semibold text-xs text-white'>
      <button class='px-4 py-1 tracking-tight {sort_option == 'stargazers_count' ? 'rounded-full bg-gray-50 text-gray-500 hover:cursor-default' : ''}' on:click={handleChange('stargazers_count')}>
         Stars
      </button>
      <button class='px-4 py-1 tracking-tight {sort_option == 'total_thumbs_up_of_top_5_closed_pr_since_1_year' ? 'rounded-full bg-gray-50 text-gray-500 hover:cursor-default' : ''}' on:click={handleChange('total_thumbs_up_of_top_5_closed_pr_since_1_year')}>
         PR 👍
      </button>
      <button class='px-4 py-1 tracking-tight {sort_option == 'total_thumbs_up_of_top_5_closed_issues_since_1_year' ? 'rounded-full bg-gray-50 text-gray-500 hover:cursor-default' : ''}' on:click={handleChange('total_thumbs_up_of_top_5_closed_issues_since_1_year')}>
         Issues 👍
      </button>
   </div>
</div>
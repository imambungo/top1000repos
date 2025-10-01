<script>
   import SortOptionButton from './SortOptionButton.svelte'

   let { sort_option } = $props()
</script>

<div class='flex flex-col gap-1'>
   <p class='text-gray-600 text-xs font-medium'>Sort</p>
   <div class='flex flex-wrap gap-1 py-0.5 w-fit font-semibold text-xs'>
      <SortOptionButton {sort_option} href='/' button_option='stargazers_count'>
         Stars
      </SortOptionButton>
      <SortOptionButton {sort_option} href='/sorted-by-pr' button_option='total_thumbs_up_of_top_5_closed_pr_since_1_year'>
         PR
         <span class='{!sort_option.option == 'total_thumbs_up_of_top_5_closed_issues_since_1_year' ? 'drop-shadow-[0_0_0.6px_rgba(0,0,0,0.4)]' : ''}'> <!-- https://stackoverflow.com/a/74753353/9157799 -->
            👍
         </span>
      </SortOptionButton>
      <SortOptionButton {sort_option} href='/sorted-by-issues' button_option='total_thumbs_up_of_top_5_closed_issues_since_1_year'>
         Issues
         <span class='{!sort_option.option == 'total_thumbs_up_of_top_5_closed_issues_since_1_year' ? 'drop-shadow-[0_0_0.6px_rgba(0,0,0,0.4)]' : ''}'> <!-- https://stackoverflow.com/a/74753353/9157799 -->
            👍
         </span>
      </SortOptionButton>
      <SortOptionButton {sort_option} href='' button_option='code_size'>
         Code Size
      </SortOptionButton>
      <SortOptionButton {sort_option} href='' button_option='project_size'>
         Project Size
      </SortOptionButton>
      <SortOptionButton {sort_option} href='' button_option='repo_size'>
         Repo Size
      </SortOptionButton>
   </div>
</div>
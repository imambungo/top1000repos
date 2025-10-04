<script>
   import TabButton from './TabButton.svelte'

   let { current_tab, repos } = $props()
</script>

<TabButton {current_tab} button_tab='explore'   content='🔍 Browse ({repos.count.explore_tab})'    shrunken_content='🔍 ({repos.count.explore_tab})'/>
<TabButton {current_tab} button_tab='bookmark'  content='🔖 Bookmark ({repos.count.bookmark_tab})' shrunken_content='🔖 ({repos.count.bookmark_tab})'/>
<TabButton {current_tab} button_tab='blacklist' content='🙈 Hidden ({repos.count.hidden_tab})'     shrunken_content='🙈 ({repos.count.hidden_tab})'/>
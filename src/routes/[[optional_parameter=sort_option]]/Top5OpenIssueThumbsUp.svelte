<script>
	let { total_thumbs_up_of_top_5_open_issue_of_all_time, html_url, has_issues_tab } = $props();

	const top_5_open_issue_url = `${html_url}/issues?q=is%3Aissue+is%3Aopen+sort%3Areactions-%2B1-desc`
</script>

{#if has_issues_tab}
	<div class='whitespace-nowrap'>
		<span title='total 👍 of the top 5 open issues (of all time)'>Top 5 open issues thumbs up</span>:
		<a href={top_5_open_issue_url} target='_blank'>
			{total_thumbs_up_of_top_5_open_issue_of_all_time}
		</a>
	</div>
{/if}
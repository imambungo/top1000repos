<script>
	export let total_thumbs_up_of_top_5_closed_issues_since_1_year
	export let html_url
	export let has_issues_tab

	import { a_year_ago } from '$lib/date.js' // https://kit.svelte.dev/docs/project-structure#project-files

	const top_5_closed_issues_url = `${html_url}/issues?q=is%3Aissue+sort%3Areactions-%2B1-desc+is%3Aclosed+closed%3A%3E${a_year_ago()}`
</script>

{#if has_issues_tab}
	<div class='whitespace-nowrap'>
		<a href={top_5_closed_issues_url} target='_blank' title='total 👍 of the top 5 closed issues of the last 12 months'>
			Top 5 closed issues (1 year) thumbs up:
			{total_thumbs_up_of_top_5_closed_issues_since_1_year}
		</a>
	</div>
{/if}
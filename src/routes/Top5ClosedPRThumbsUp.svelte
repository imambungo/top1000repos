<script>
	export let total_thumbs_up_of_top_5_closed_pr_since_1_year
	export let html_url

	import { a_year_ago } from '$lib/date.js' // https://kit.svelte.dev/docs/project-structure#project-files

	const top_5_pr_url = `${html_url}/pulls?q=is%3Apr+sort%3Areactions-%2B1-desc+is%3Aclosed+closed%3A%3E${a_year_ago()}`
</script>

{#if total_thumbs_up_of_top_5_closed_pr_since_1_year != 0}
	<div class='whitespace-nowrap'>
		<span title='total 👍 of the top 5 closed (possibly merged) PRs of the last 12 months'>Top 5 closed PRs (1 year) thumbs up</span>:
		<a href={top_5_pr_url} target='_blank'>
			{total_thumbs_up_of_top_5_closed_pr_since_1_year}
		</a>
	</div>
{/if}
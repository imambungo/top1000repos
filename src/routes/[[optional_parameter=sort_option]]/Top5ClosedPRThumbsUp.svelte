<script>
	let { total_thumbs_up_of_top_5_closed_pr_since_1_year, html_url } = $props();
	import { a_year_ago } from '$lib/date.js' // https://kit.svelte.dev/docs/project-structure#project-files
	const top_5_closed_pr_url = `${html_url}/pulls?q=is%3Apr+sort%3Areactions-%2B1-desc+is%3Aclosed+closed%3A%3E${a_year_ago()}`
</script>

<div class='whitespace-nowrap'>
	<a href={top_5_closed_pr_url} target='_blank' title='total 👍 of the top 5 closed (possibly merged) PRs of the last 12 months'>
		<span class='decoration-gray-300 underline'>Top 5 closed PRs</span>
		(1 year) thumbs up:
		<span class='decoration-gray-300 underline font-medium'>{total_thumbs_up_of_top_5_closed_pr_since_1_year}</span>
	</a>
</div>
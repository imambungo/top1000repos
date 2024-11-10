<script>
	let { num_of_closed_pr_since_1_year, html_url } = $props()

	const color = () => {
		if (num_of_closed_pr_since_1_year <= 10 || num_of_closed_pr_since_1_year == null)
			return 'text-red-600'
		if (num_of_closed_pr_since_1_year <= 50)
			return 'text-orange-400'
		if (num_of_closed_pr_since_1_year <= 150)
			return 'text-yellow-500'
		if (num_of_closed_pr_since_1_year >= 1000)
			return 'text-green-500'
	}

	import { a_year_ago } from '$lib/date.js' // https://kit.svelte.dev/docs/project-structure#project-files

	const top_5_closed_pr_url = `${html_url}/pulls?q=is%3Apr+sort%3Areactions-%2B1-desc+is%3Aclosed+closed%3A%3E${a_year_ago()}`

	const boldIfZero = () => {
		if (num_of_closed_pr_since_1_year == 0)
			return 'font-black'
	}
</script>

<div class='whitespace-nowrap'>
	<span title='*since the last 12 months'>Number of closed PRs*</span>:
	<a href={top_5_closed_pr_url} target='_blank' class='{color()} {boldIfZero()}'>
		{num_of_closed_pr_since_1_year}
	</a>
</div>
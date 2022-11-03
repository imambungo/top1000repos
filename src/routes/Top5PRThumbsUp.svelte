<script>
	export let top_5_pr_thumbs_up
	export let html_url

	const color = () => {
		if (top_5_pr_thumbs_up == 0 || top_5_pr_thumbs_up == null)
			return 'text-red-600'
		if (top_5_pr_thumbs_up <= 10)
			return 'text-orange-400'
		if (top_5_pr_thumbs_up <= 20)
			return 'text-yellow-500'
		if (top_5_pr_thumbs_up >= 100)
			return 'text-green-500'
	}

	import a_year_ago from '$lib/date.js' // https://kit.svelte.dev/docs/project-structure#project-files

	const top_5_pr_url = `${html_url}/pulls?q=is%3Apr+sort%3Areactions-%2B1-desc+is%3Aclosed+closed%3A%3E${a_year_ago()}`
</script>

<div class='whitespace-nowrap'>
	<span title='total 👍 of the top 5 closed (possibly merged) PRs of the last 12 months'>Top 5 PRs thumbs up</span>:
	<a href={top_5_pr_url} target='_blank' class='{color()} {top_5_pr_thumbs_up == null && "font-black"}'> <!-- font-black means the boldest possible in tailwindcss -->
		{top_5_pr_thumbs_up ? top_5_pr_thumbs_up : 0} <!-- if null (no closed PR in the last 1 year), set to 0 -->
	</a>
</div>

<script>
	export let num_of_closed_pr_since_1_year
	export let html_url

	const color = () => {
		if (num_of_closed_pr_since_1_year == 0 || num_of_closed_pr_since_1_year == null)
			return 'text-red-600'
		if (num_of_closed_pr_since_1_year <= 10)
			return 'text-orange-400'
		if (num_of_closed_pr_since_1_year <= 20)
			return 'text-yellow-500'
		if (num_of_closed_pr_since_1_year >= 100)
			return 'text-green-500'
	}

	const aYearAgo = () => {
		const date = new Date()
		date.setDate(date.getDate() - 365) // https://stackoverflow.com/a/13838662/9157799
		return date.toISOString().slice(0, 10) // https://stackoverflow.com/a/35922073/9157799
	}

	const top_5_pr_url = `${html_url}/pulls?q=is%3Apr+sort%3Areactions-%2B1-desc+is%3Aclosed+closed%3A%3E${aYearAgo()}`
</script>

<div class='whitespace-nowrap'>
	<span title='*since the last 12 months'>Number of closed PRs*</span>:
	<a href={top_5_pr_url} target='_blank' class='{color()}'>
		{num_of_closed_pr_since_1_year}
	</a>
</div>
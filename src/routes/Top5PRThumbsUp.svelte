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

	const aYearAgo = () => {
		const date = new Date()
		date.setDate(date.getDate() - 365) // https://stackoverflow.com/a/13838662/9157799
		return date.toISOString().slice(0, 10) // https://stackoverflow.com/a/35922073/9157799
	}

	const top_5_pr_url = `${html_url}/pulls?q=is%3Apr+sort%3Areactions-%2B1-desc+is%3Aclosed+closed%3A%3E${aYearAgo()}`
</script>

<div class='whitespace-nowrap'>
	Top 5 PRs thumbs up:
	<a href={top_5_pr_url} target='_blank' class='{color()} {top_5_pr_thumbs_up == null && "font-black"}'> <!-- font-black means the boldest possible in tailwindcss | use span because it's an inline elemtn, so we don't need to wrap things in a flex div -->
		{top_5_pr_thumbs_up ? top_5_pr_thumbs_up : 0} <!-- if null (no closed PR in the last 1 year), set to 0 -->
	</a>
</div>

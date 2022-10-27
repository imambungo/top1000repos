<script>
	export let top_5_pr_thumbs_up

	const color = () => {
		if (top_5_pr_thumbs_up <= 3)
			return 'text-red-600'
		if (top_5_pr_thumbs_up <= 10)
			return 'text-orange-600'
		if (top_5_pr_thumbs_up <= 50)
			return 'text-yellow-600'
		if (top_5_pr_thumbs_up <= 100)
			return 'text-green-600'
		return 'text-blue-600'
	}
</script>

<div class='basis-2/5 whitespace-nowrap'>
	Top 5 PRs thumbs up:
	<span class='{color()}'> <!-- use span because it's an inline elemtn, so we don't need to wrap things in a flex div -->
		{top_5_pr_thumbs_up}
	</span>
</div>

<script>
	export let top_5_pr_thumbs_up

	const color = () => {
		if (top_5_pr_thumbs_up == 0)
			return 'text-red-600'
		if (top_5_pr_thumbs_up <= 10)
			return 'text-orange-400'
		if (top_5_pr_thumbs_up <= 20)
			return 'text-yellow-500'
		if (top_5_pr_thumbs_up >= 100)
			return 'text-green-500'
	}
</script>

<div class='whitespace-nowrap'>
	Top 5 PRs thumbs up:
	<span class='{color()}'> <!-- use span because it's an inline elemtn, so we don't need to wrap things in a flex div -->
		{top_5_pr_thumbs_up}
	</span>
</div>

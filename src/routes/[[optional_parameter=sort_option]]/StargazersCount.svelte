<script>
	let { stargazers_count } = $props();

	const readableNumber = number => { // https://stackoverflow.com/a/60988355/9157799
		const formatter = Intl.NumberFormat('en', { notation: 'compact' })
		let result = formatter.format(number)
		return result.toLowerCase()
	}
</script>

<div class="flex"> <!-- stars -->
	<p class="font-bold mr-0.5">✩</p>
	{readableNumber(stargazers_count)}
</div>

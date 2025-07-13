<script>
	let { stargazers_count } = $props();

	const readableNumber = number => { // https://stackoverflow.com/a/60988355/9157799
		let formatter
		if (number >= 100000) { // https://github.com/imambungo/top1000repos/issues/12
			formatter = Intl.NumberFormat('en', { notation: 'compact' })
		} else { // https://stackoverflow.com/q/9461621/9157799#comment132576462_60988355
			formatter = Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 })
		}
		let result = formatter.format(number)
		return result.toLowerCase()
	}
</script>

<div class="flex"> <!-- stars -->
	<p class="font-bold mr-0.5">✩</p>
	{readableNumber(stargazers_count)}
</div>

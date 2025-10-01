<script>
	let { last_commit_date } = $props(); // https://stackoverflow.com/q/15918588/9157799#comment88211717_15922637

	const daysAgo = () => { // https://stackoverflow.com/a/47181114/9157799
		const startDate  = new Date(last_commit_date)
		const endDate    = new Date()
		const diffInMs   = endDate - startDate
		const diffInDays = diffInMs / (1000 * 60 * 60 * 24)
		return parseInt(diffInDays)
	}

	const agoFormat = () => {
		const total_days = daysAgo()
		const years      = parseInt(total_days / 365)
		const remaining  = total_days % 365
		const months     = parseInt(remaining / 30)
		const days       = remaining % 30

		let result = ''
		if (years > 0) {
			result += `${years} year`
			if (years > 1) result += 's'
			if (months == 0) return result + ' ago'
		}
		if (months > 0) {
			if (years >= 1) result += ', '
			result += `${months} month`
			if (months > 1) result += 's'
			if (years >= 1) return result + ' ago'
		}
		if (months == 0 && days < 3) return 'recently'
		if (months >= 1 && months < 3) result += ', '
		if (months <  3) {
			result += `${days} days`
		}
		return result + ' ago'
	}

	const color = () => {
		const days_ago = daysAgo()
		if (days_ago <= 90) // 1-3 months
			return ''
		if (days_ago > 90 && days_ago <= 183) // 3-6 months
			return 'text-yellow-500'
		if (days_ago > 183 && days_ago <= 365) // 6-12 months
			return 'text-orange-400'
		return 'text-red-600'
	}

	const tooltip = () => {
		if (daysAgo() < 3)
			return 'today or yesterday'
		else
			return last_commit_date
	}
</script>

<div class='cursor-help' title={tooltip()}>
	<span>Last commit:</span>
	<span class={color()}> <!-- use span because it's an inline element, so we don't need to wrap things in a flex div -->
		{agoFormat()}
	</span>
</div>

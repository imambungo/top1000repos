<script>
	export let last_commit_date

	const daysAgo = () => { // https://stackoverflow.com/a/47181114/9157799
		const startDate  = new Date(last_commit_date)
		const endDate    = new Date()
		const diffInMs   = endDate - startDate
		const diffInDays = diffInMs / (1000 * 60 * 60 * 24)
		return parseInt(diffInDays)
	}

	const format = () => {
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
		if (days > 0) {
			if (months == 0 && days == 1) return 'yesterday'
			if (months >= 1 && months < 3) result += ', '
			if (months <  3) {
				result += `${days} days`
			}
			return result + ' ago'
		}
		return 'today'
	}

	const color = () => {
		const days_ago = daysAgo()
		if (days_ago <= 60) // less than 2 months
			return 'text-green-600'
		if (days_ago <= 183) // 2-6 months
			return 'text-yellow-600'
		if (days_ago <= 365) // 6-12 months
			return 'text-orange-600'
		return 'text-red-600'
	}
</script>

<div class='grow'>
	Last update:
	<span title={last_commit_date} class={color()}>
		{format()}
	</span> <!-- title is tooltip -->
</div>

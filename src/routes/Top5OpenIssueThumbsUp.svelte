<script>
	export let total_thumbs_up_of_top_5_open_issue_of_all_time
	export let html_url

	const color = () => {
		if (total_thumbs_up_of_top_5_open_issue_of_all_time == 0)
			return 'text-red-600'
		if (total_thumbs_up_of_top_5_open_issue_of_all_time <= 10)
			return 'text-orange-400'
		if (total_thumbs_up_of_top_5_open_issue_of_all_time <= 20)
			return 'text-yellow-500'
		if (total_thumbs_up_of_top_5_open_issue_of_all_time >= 100)
			return 'text-green-500'
	}

	const top_5_open_issue_url = `${html_url}/issues?q=is%3Aissue+is%3Aopen+sort%3Areactions-%2B1-desc`
</script>

<div class='whitespace-nowrap'>
	<span title='total 👍 of the top 5 open issues (of all time)'>Top 5 open issues thumbs up</span>:
	<a href={top_5_open_issue_url} target='_blank' class='{color()}'>
		{total_thumbs_up_of_top_5_open_issue_of_all_time}
	</a>
</div>

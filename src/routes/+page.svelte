<script>
	import StargazersCount from './StargazersCount.svelte'
	import LastCommitDate from './LastCommitDate.svelte'
	import Top5ClosedPRThumbsUp from './Top5ClosedPRThumbsUp.svelte'
	import Top5ClosedIssuesThumbsUp from './Top5ClosedIssuesThumbsUp.svelte'
	import Top5OpenIssueThumbsUp from './Top5OpenIssueThumbsUp.svelte'
	import Description from './Description.svelte'
	import Number from './Number.svelte'
	import NumOfClosedPR from './NumOfClosedPR.svelte'
	import NumOfClosedIssues from './NumOfClosedIssues.svelte'

	import {
		filter_blacklisted_repos_based_on_current_tab,
		filter_whitelisted_repos_based_on_current_tab
	} from './repos_filter_functions' // bisa pake .js atau tidak

	import { sort_repos_based_on_sort_option } from './repos_sort_functions'

	import { onMount } from 'svelte'; // https://stackoverflow.com/a/74165772/9157799

	import {
		local_storage as ls,
		session_storage as ss
	} from '$lib/local_storage.js'

	onMount(async () => { // https://stackoverflow.com/a/74165772/9157799
		all_repos = await fetchRepos()
		all_repos = sort_repos_based_on_sort_option(all_repos, sort_option)
		all_repos = all_repos.map((repo, index) => ({...repo, rank: index+1}))
		excluded_topics = ss.getItem('excluded_topics') || []
		repo_id_blacklist = ls.getItem('repo_id_blacklist') || []
		repo_id_whitelist = ls.getItem('repo_id_whitelist') || []
	})

	import { PUBLIC_BACKEND_URL } from '$env/static/public'; // https://kit.svelte.dev/docs/modules#$env-static-public

	const fetchRepos = async () => {
		const response = await fetch(`${PUBLIC_BACKEND_URL}/repositories`)
		const repositories = await response.json()
		return repositories
	}

	let all_repos = []
	let repos = [] // https://stackoverflow.com/q/61105696/9157799#comment108104142_61105696

	let excluded_topics = []
	const excludeTopicToggle = event => {
		const topic = event.target.innerText // https://stackoverflow.com/a/68455563/9157799
		if (!excluded_topics.includes(topic)) // if topic not excluded yet, add to excluded_topics
			excluded_topics = [...excluded_topics, topic] // https://svelte.dev/tutorial/updating-arrays-and-objects
		else // if already excluded, remove from excluded_topics
			excluded_topics = excluded_topics.filter(t => t !== topic) // https://stackoverflow.com/a/44433050/9157799
		ss.setItem('excluded_topics', excluded_topics)
	}

	let repo_id_blacklist = []
	const blacklistRepo = repo_id => {
		repo_id_blacklist = [...repo_id_blacklist, repo_id]
		ls.setItem('repo_id_blacklist', repo_id_blacklist)
	}
	const removeFromBlackList = repo_id => {
		repo_id_blacklist = repo_id_blacklist.filter(id => id != repo_id)
		ls.setItem('repo_id_blacklist', repo_id_blacklist)
	}

	let repo_id_whitelist = []
	const whitelistRepo = repo_id => {
		repo_id_whitelist = [...repo_id_whitelist, repo_id]
		ls.setItem('repo_id_whitelist', repo_id_whitelist)
	}
	const removeFromWhiteList = repo_id => {
		repo_id_whitelist = repo_id_whitelist.filter(id => id != repo_id)
		ls.setItem('repo_id_whitelist', repo_id_whitelist)
	}

	let current_tab = 'explore'
	let sort_option = 'stargazers_count'
	let numbering = 'rank'

	$: { // a bruteforce hammer solution, but it's fine. what causes the slowness is the rendering
		repos = all_repos
		repos = filter_blacklisted_repos_based_on_current_tab(repos, repo_id_blacklist, current_tab)
		repos = filter_whitelisted_repos_based_on_current_tab(repos, repo_id_whitelist, current_tab)
		repos = sort_repos_based_on_sort_option(repos, sort_option)
	}

	const get_how_many_repos_in_id_list = (all_repos, repo_id_list) => {
		let count = 0
		all_repos.forEach(repo => {
			if (repo_id_list.includes(repo.id))
				count++
		})
		return count
	}
	$: blacklist_tab_repos_count = get_how_many_repos_in_id_list(all_repos, repo_id_blacklist) // don't just use repo_id_blacklist.length because when a blacklisted repo is no longer in top 1000, it still get counted
	$: whitelist_tab_repos_count = get_how_many_repos_in_id_list(all_repos, repo_id_whitelist) // don't just use repo_id_whitelist.length because when a whitelisted repo is no longer in top 1000, it still get counted
	$: explore_tab_repos_count = 1000 - blacklist_tab_repos_count - whitelist_tab_repos_count

	const get_excluded_repos_count = (repos, excluded_topics) => {
		let count = 0
		repos.forEach(repo => {
			if (repo.topics.some(topic => excluded_topics.includes(topic))) // if one of the repo topic is in excluded_topics | https://stackoverflow.com/q/16312528/9157799
				count++
		})
		return count
	}
	$: excluded_repos_count = get_excluded_repos_count(repos, excluded_topics)
</script>

<main class="max-w-3xl mx-auto">
	<h1>GitHub Top 1000 Repositories</h1>

	<div>
		Tab:
		<button on:click={() => current_tab = 'explore'}> <!-- https://stackoverflow.com/q/58262380/9157799 -->
			explore ({explore_tab_repos_count})
		</button>
		<button on:click={() => current_tab = 'whitelist'}>
			whitelist ({whitelist_tab_repos_count})
		</button>
		<button on:click={() => current_tab = 'blacklist'}>
			blacklist ({blacklist_tab_repos_count})
		</button>
	</div>

	<div> <!-- TODO: after clicked, the button should be unclickable -->
		Sort by:
		<button on:click={() => sort_option = 'stargazers_count'}>
			stars
		</button>
		<button on:click={() => sort_option = 'total_thumbs_up_of_top_5_closed_pr_since_1_year'}>
			Top 5 closed PR thumbs up
		</button>
		<button on:click={() => sort_option = 'total_thumbs_up_of_top_5_closed_issues_since_1_year'}>
			Top 5 closed issues thumbs up
		</button>
	</div>

	<div>
		Numbering:
		<button on:click={() => numbering = 'rank'}>
			rank
		</button>
		<button on:click={() => numbering = 'order'}>
			order
		</button>
	</div>

	<p>Excluded topics:</p>
	<div class="flex flex-wrap gap-1 mt-1"> <!-- excluded topics -->
		{#each excluded_topics as topic}
			<div on:click={excludeTopicToggle} class="cursor-pointer rounded-full bg-sky-100 px-2 pb-0.5 text-sm text-blue-500">{topic}</div>
		{/each}
	</div>

	{#if all_repos.length == 0} <!-- https://stackoverflow.com/a/66080028/9157799 | https://svelte.dev/docs#template-syntax-await -->
		<p>Hang on..</p>
	{:else}
		Excluded: {excluded_repos_count}
		<div class='flex flex-col gap-5'>
			{#each repos as repo, index (repo.id)} <!-- the key (repo.id) is to fix the performance | https://svelte.dev/docs#template-syntax-each -->
				<div class="flex {repo.topics.some(topic => excluded_topics.includes(topic)) && 'opacity-50'}"> <!-- dim if topics is in excluded_topics | https://stackoverflow.com/q/16312528/9157799 -->
					<Number numbering={numbering} rank={repo.rank} order={index+1}/> <!-- NUMBER -->
					<div class='grow flex flex-col gap-1'> <!-- the rest | grow against number -->
						<div class='flex flex-wrap gap-2'>
							<a href="{repo.html_url}" class="text-blue-600">{repo.full_name}</a> <!-- REPO FULL NAME -->
							{#if repo.archived}
								<div> <!-- this div prevent "Public archive" from expanding to the full_name height -->
									<span class='rounded-full border-solid px-2 py-1 text-xs text-yellow-600 border border-yellow-600'>Public archive</span>
								</div>
							{/if}
							<div class='grow flex justify-end'>
								{#if current_tab == 'explore'}
									<button on:click={() => whitelistRepo(repo.id)}> <!-- https://stackoverflow.com/q/58262380/9157799 -->
										whitelist
									</button>
									<button on:click={() => blacklistRepo(repo.id)}> <!-- https://stackoverflow.com/q/58262380/9157799 -->
										blacklist
									</button>
								{:else if current_tab == 'blacklist'}
									<button on:click={() => removeFromBlackList(repo.id)}> <!-- https://stackoverflow.com/q/58262380/9157799 -->
										remove blacklist
									</button>
								{:else if current_tab == 'whitelist'}
									<button on:click={() => removeFromWhiteList(repo.id)}> <!-- https://stackoverflow.com/q/58262380/9157799 -->
										remove whitelist
									</button>
								{/if}
							</div>
						</div>
						<Description description={repo.description}/> <!-- REPO DESCRIPTION -->
						{#if repo.topics.length > 0} <!-- topics | if clause to prevent parent's flex gap -->
							<div class="flex flex-wrap gap-1">
								{#each repo.topics as topic}
									<div on:click={excludeTopicToggle} class="cursor-pointer rounded-full bg-sky-100 px-2 py-1 text-xs text-blue-500 {excluded_topics.includes(topic) && 'line-through'}">{topic}</div>
								{/each}
							</div>
						{/if}
						<div class='flex flex-wrap gap-x-4 text-xs text-gray-600'> <!-- last_commit_date & PRs thumbs up -->
							<StargazersCount stargazers_count={repo.stargazers_count}/>
							<Top5ClosedPRThumbsUp total_thumbs_up_of_top_5_closed_pr_since_1_year={repo.total_thumbs_up_of_top_5_closed_pr_since_1_year} html_url={repo.html_url}/>
							<Top5ClosedIssuesThumbsUp total_thumbs_up_of_top_5_closed_issues_since_1_year={repo.total_thumbs_up_of_top_5_closed_issues_since_1_year} html_url={repo.html_url} has_issues_tab={repo.has_issues}/>
							<!-- <Top5OpenIssueThumbsUp total_thumbs_up_of_top_5_open_issue_of_all_time={repo.total_thumbs_up_of_top_5_open_issue_of_all_time} html_url={repo.html_url} has_issues_tab={repo.has_issues}/> -->
							<LastCommitDate last_commit_date={repo.last_commit_date}/>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</main>

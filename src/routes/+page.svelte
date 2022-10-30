<script>
	import StargazersCount from './StargazersCount.svelte'
	import LastCommitDate from './LastCommitDate.svelte'
	import Top5PRThumbsUp from './Top5PRThumbsUp.svelte'
	import Description from './Description.svelte'

	import {
		filter_out_repos_with_excluded_topics,
		filter_blacklisted_repos_based_on_current_tab
	} from './repos_filter_functions' // bisa pake .js atau tidak

	import {
		sort_repos_by_stars,
		sort_repos_by_top_5_PR_thumbs_up,
		sort_repos_based_on_sort_option
	} from './repos_sort_functions'

	import { onMount } from 'svelte'; // https://stackoverflow.com/a/74165772/9157799

	onMount(async () => { // https://stackoverflow.com/a/74165772/9157799
		all_repos = await fetchAllReposOrGetFromLocalStorage()
		excluded_topics = getExcludedTopicsFromSessionStorage()
		repos = sort_repos_by_stars(all_repos)
		//repos = filter_out_repos_with_excluded_topics(repos, excluded_topics)
	})

	const getExcludedTopicsFromSessionStorage = () => {
		let excludedTopics = sessionStorage.getItem('excluded_topics')
		if (excludedTopics != null) {
			excludedTopics = JSON.parse(excludedTopics)
			return excludedTopics
		}
		return []
	}

	const fetchAllReposOrGetFromLocalStorage = async () => {
		const getAllReposFromLocalStorage = () => { // https://stackoverflow.com/a/2010948/9157799
			let localRepos = localStorage.getItem('all_repos')
			localRepos = JSON.parse(localRepos)
			return localRepos
		}

		const fetchReposAndStoreToLocalStorage = async () => {
			const fetchRepos = async () => {
				const response = await fetch('http://localhost:3000/repositories')
				const repositories = await response.json()
				return repositories
			}
			const allRepos = await fetchRepos() // https://stackoverflow.com/a/66080028/9157799
			localStorage.setItem("all_repos", JSON.stringify(allRepos)) // https://stackoverflow.com/a/2010948/9157799
			return allRepos
		}

		const today = () => {
			return new Date().toISOString().slice(0, 10) // https://stackoverflow.com/a/35922073/9157799
		}

		let localRepos = localStorage.getItem('all_repos')
		if (localRepos == null) { // first visit
			return await fetchReposAndStoreToLocalStorage()
		} else {
			localRepos = JSON.parse(localRepos)
			if (localRepos[99].last_verified_at < today()) { // if old data
				return await fetchReposAndStoreToLocalStorage()
			} else {
				return getAllReposFromLocalStorage()
			}
		}
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
		sessionStorage.setItem('excluded_topics', JSON.stringify(excluded_topics))
	}

	let repo_id_blacklist = []
	const blacklistRepo = repo_id => {
		repo_id_blacklist = [...repo_id_blacklist, repo_id]
	}
	const removeFromBlackList = repo_id => {
		repo_id_blacklist = repo_id_blacklist.filter(id => id != repo_id)
	}

	let current_tab = 'explore'
	let sort_option = 'stars'

	$: { // a bruteforce hammer solution, but it's fine. what causes the slowness is the rendering
		repos = filter_blacklisted_repos_based_on_current_tab(all_repos, repo_id_blacklist, current_tab)
		//repos = filter_out_repos_with_excluded_topics(repos, excluded_topics)
		repos = sort_repos_based_on_sort_option(repos, sort_option)
	}

	$: explore_tab_repos_count = 1000-repo_id_blacklist.length
	$: blacklist_tab_repos_count = repo_id_blacklist.length

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

	<div> <!-- TODO: after clicked, the button should be unclickable -->
		Sort by:
		<button on:click={() => sort_option = 'stars'}>
			stars
		</button>
		<button on:click={() => sort_option = 'top 5 pr thumbs up'}>
			Top 5 PR thumbs up
		</button>
	</div>

	<p>Excluded topics:</p>
	<div class="flex flex-wrap gap-1 mt-1"> <!-- excluded topics -->
		{#each excluded_topics as topic}
			<div on:click={excludeTopicToggle} class="cursor-pointer rounded-full bg-sky-100 px-2 pb-0.5 text-sm text-blue-500">{topic}</div>
		{/each}
	</div>

	<div>
		Tab:
		<button on:click={() => current_tab = 'explore'}> <!-- https://stackoverflow.com/q/58262380/9157799 -->
			explore ({explore_tab_repos_count})
		</button>
		<button on:click={() => current_tab = 'blacklist'}>
			blacklist ({blacklist_tab_repos_count})
		</button>
	</div>

	{#if all_repos.length == 0} <!-- https://stackoverflow.com/a/66080028/9157799 | https://svelte.dev/docs#template-syntax-await -->
		<p>Hang on..</p>
	{:else}
		Excluded: {excluded_repos_count}
		<div class='flex flex-col gap-5'>
			{#each repos as repo, i (repo.id)} <!-- the key (repo.id) is to fix the performance | https://svelte.dev/docs#template-syntax-each -->
				<div class="flex {repo.topics.some(topic => excluded_topics.includes(topic)) && 'opacity-50'}"> <!-- dim if topics is in excluded_topics | https://stackoverflow.com/q/16312528/9157799 -->
					<div class="w-10 text-right shrink-0 mr-3 text-gray-700"> <!-- number | shrink: https://stackoverflow.com/a/45741742/9157799 -->
						{i+1}
					</div>
					<div class='grow flex flex-col gap-1'> <!-- the rest | grow against number -->
						<div class='flex flex-wrap gap-2'>
							<a href="{repo.html_url}" class="text-blue-600">{repo.full_name}</a>
							{#if repo.archived}
								<div> <!-- this div prevent "Public archive" from expanding to the full_name height -->
									<span class='rounded-full border-solid px-2 py-1 text-xs text-yellow-600 border border-yellow-600'>Public archive</span>
								</div>
							{/if}
							<div class='grow flex justify-end'>
								{#if current_tab == 'explore'}
									<button on:click={() => blacklistRepo(repo.id)}> <!-- https://stackoverflow.com/q/58262380/9157799 -->
										blacklist
									</button>
								{:else if current_tab == 'blacklist'}
									<button on:click={() => removeFromBlackList(repo.id)}> <!-- https://stackoverflow.com/q/58262380/9157799 -->
										remove blacklist
									</button>
								{/if}
							</div>
						</div>
						<Description description={repo.description}/>
						{#if repo.topics.length > 0} <!-- topics | if clause to prevent parent's flex gap -->
							<div class="flex flex-wrap gap-1">
								{#each repo.topics as topic}
									<div on:click={excludeTopicToggle} class="cursor-pointer rounded-full bg-sky-100 px-2 py-1 text-xs text-blue-500 {excluded_topics.includes(topic) && 'line-through'}">{topic}</div>
								{/each}
							</div>
						{/if}
						<div class='flex flex-wrap gap-x-4 text-xs text-gray-600'> <!-- last_commit_date & PRs thumbs up -->
							<StargazersCount stargazers_count={repo.stargazers_count}/>
							<Top5PRThumbsUp top_5_pr_thumbs_up={repo.top_5_pr_thumbs_up}/>
							<LastCommitDate last_commit_date={repo.last_commit_date}/>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</main>

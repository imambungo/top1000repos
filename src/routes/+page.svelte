<script>
	import StargazersCount from './StargazersCount.svelte'
	import LastCommitDate from './LastCommitDate.svelte'
	import Top5PRThumbsUp from './Top5PRThumbsUp.svelte'
	import Description from './Description.svelte'

	import { onMount } from 'svelte'; // https://stackoverflow.com/a/74165772/9157799

	onMount(async () => { // https://stackoverflow.com/a/74165772/9157799
		await fetchAllReposOrLoadFromLocalStorage()
		loadExcludedTopicsFromSessionStorage()
		sortByStars()
	})

	const loadExcludedTopicsFromSessionStorage = () => {
		const excludedTopics = sessionStorage.getItem('excluded_topics')
		if (excludedTopics != null) {
			excluded_topics = JSON.parse(excludedTopics)
			updateTotalExcluded()
		}
	}

	const fetchAllReposOrLoadFromLocalStorage = async () => {
		let localRepos = localStorage.getItem('all_repos')
		if (localRepos == null) { // first visit
			await fetchReposAndStoreToLocalStorage()
		} else {
			localRepos = JSON.parse(localRepos)
			if (localRepos[99].last_verified_at < today()) { // if old data
				await fetchReposAndStoreToLocalStorage()
			} else {
				loadAllReposFromLocalStorage()
			}
		}
	}

	const today = () => {
		return new Date().toISOString().slice(0, 10) // https://stackoverflow.com/a/35922073/9157799
	}

	const loadAllReposFromLocalStorage = () => { // https://stackoverflow.com/a/2010948/9157799
		const inString = localStorage.getItem('all_repos')
		all_repos = JSON.parse(inString)
	}

	const fetchReposAndStoreToLocalStorage = async () => {
		all_repos = await fetchRepos() // https://stackoverflow.com/a/66080028/9157799
		localStorage.setItem("all_repos", JSON.stringify(all_repos)) // https://stackoverflow.com/a/2010948/9157799
	}

	const updateFilteredRepositories = () => { // to be called whenever all_repos or excluded_topics changed
		const noExcludedTopicsOrBlacklistedRepo = repo => {
			if (repo.topics.some(topic => excluded_topics.includes(topic))) // if the repo topics is in excluded topics | https://stackoverflow.com/q/16312528/9157799
				return false
			if (repo_id_blacklist.includes(repo.id))
				return false
			return true
		}
		repos = all_repos.filter(noExcludedTopicsOrBlacklistedRepo)
	}

	const fetchRepos = async () => {
		const response = await fetch('http://localhost:3000/repositories')
		const repositories = await response.json()
		return repositories
	}

	let all_repos = []
	let repos = [] // https://stackoverflow.com/q/61105696/9157799#comment108104142_61105696

	const sortByStars = () => {
		const compareStars = (a, b) => { // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
			if (a.stargazers_count > b.stargazers_count)
				return -1 // a first, then b
			if (a.stargazers_count < b.stargazers_count)
				return 1 // b first, then a
			return 0
		}
		all_repos = all_repos.sort(compareStars) // https://svelte.dev/tutorial/updating-arrays-and-objects
		updateFilteredRepositories()
	}

	const sortByTop5PRThumbsUp = () => {
		const compareStars = (a, b) => {
			if (a.top_5_pr_thumbs_up > b.top_5_pr_thumbs_up)
				return -1 // a first, then b
			if (a.top_5_pr_thumbs_up < b.top_5_pr_thumbs_up)
				return 1 // b first, then a
			return 0
		}
		all_repos = all_repos.sort(compareStars) // https://svelte.dev/tutorial/updating-arrays-and-objects
		updateFilteredRepositories()
	}

	let excluded_topics = []
	const excludeTopicToggle = event => {
		const topic = event.target.innerText // https://stackoverflow.com/a/68455563/9157799
		if (!excluded_topics.includes(topic)) // if topic not excluded yet, add to excluded_topics
			excluded_topics = [...excluded_topics, topic] // https://svelte.dev/tutorial/updating-arrays-and-objects
		else // if already excluded, remove from excluded_topics
			excluded_topics = excluded_topics.filter(t => t !== topic) // https://stackoverflow.com/a/44433050/9157799
		updateTotalExcluded() // because there's no button to re-assign total_excluded (Svelte's reactivity is triggered by assignments)
		updateFilteredRepositories()
		sessionStorage.setItem('excluded_topics', JSON.stringify(excluded_topics))
	}

	let total_excluded = 0
	const updateTotalExcluded = () => {
		let count = 0
		all_repos.forEach(repo => {
			if (repo.topics.some(topic => excluded_topics.includes(topic))) // if the repo topics is in excluded topics | https://stackoverflow.com/q/16312528/9157799
				count++
		})
		total_excluded = count
	}

	let tab = 'explore'
	let repo_id_blacklist = []
	const blacklistRepo = repo_id => {
		repo_id_blacklist = [...repo_id_blacklist, repo_id]
		updateFilteredRepositories()
	}

	const switchTab = tab => {
		if (tab == 'blacklist') {
			const blacklistedRepos = all_repos.filter(repo => repo_id_blacklist.includes(repo.id))
			repos = blacklistedRepos
		}
		if (tab == 'explore') {
			updateFilteredRepositories()
		}
	}
</script>

<main class="max-w-3xl mx-auto">
	<h1>GitHub Top 1000 Repositories</h1>

	<div> <!-- TODO: after clicked, the button should be unclickable -->
		Sort by:
		<button on:click={sortByStars}>
			stars
		</button>
		<button on:click={sortByTop5PRThumbsUp}>
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
		<button on:click={() => switchTab('explore')}> <!-- https://stackoverflow.com/q/58262380/9157799 -->
			explore
		</button>
		<button on:click={() => switchTab('blacklist')}>
			blacklist
		</button>
	</div>

	{#if repos.length == 0} <!-- https://stackoverflow.com/a/66080028/9157799 | https://svelte.dev/docs#template-syntax-await -->
		<p>Hang on..</p>
	{:else}
		{1000-total_excluded} result, {total_excluded} dimmed.
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
								<button on:click={() => blacklistRepo(repo.id)}> <!-- https://stackoverflow.com/q/58262380/9157799 -->
									blacklist
								</button>
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

<script>
	import StargazersCount from './StargazersCount.svelte'
	import LastCommitDate from './LastCommitDate.svelte'
	import Top5PRThumbsUp from './Top5PRThumbsUp.svelte'

	import { onMount } from 'svelte'; // https://stackoverflow.com/a/74165772/9157799

	onMount(async () => { // https://stackoverflow.com/a/74165772/9157799
		let allRepositoriesLS = localStorage.getItem('allRepositories')
		if (allRepositoriesLS == null) { // first visit
			await fetchRepositoriesAndStore()
		} else {
			allRepositoriesLS = JSON.parse(allRepositoriesLS)
			if (allRepositoriesLS[99].last_verified_at < today()) {
				await fetchRepositoriesAndStore()
			} else {
				loadAllReposFromLocalStorage()
			}
		}

		sortByStars()
	})

	const today = () => {
		return new Date().toISOString().slice(0, 10) // https://stackoverflow.com/a/35922073/9157799
	}

	const loadAllReposFromLocalStorage = () => { // https://stackoverflow.com/a/2010948/9157799
		const inString = localStorage.getItem('allRepositories')
		allRepositories = JSON.parse(inString)
	}

	const fetchRepositoriesAndStore = async () => {
		allRepositories = await fetchRepositories() // https://stackoverflow.com/a/66080028/9157799
		localStorage.setItem("allRepositories", JSON.stringify(allRepositories)) // https://stackoverflow.com/a/2010948/9157799
	}

	const updateFilteredRepositories = () => { // called by sort functions only
		const noExcludedTopics = repository => {
			if (repository.topics.some(topic => excluded_topics.includes(topic))) // if the repo topics is in excluded topics | https://stackoverflow.com/q/16312528/9157799
				return false
			return true
		}
		filteredRepositories = allRepositories.filter(noExcludedTopics)
	}

	const fetchRepositories = async () => {
		const response = await fetch('http://localhost:3000/repositories')
		const repositories = await response.json()
		return repositories
	}

	let allRepositories = []
	let filteredRepositories = [] // https://stackoverflow.com/q/61105696/9157799#comment108104142_61105696

	const sortByStars = () => {
		const compareStars = (a, b) => { // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
			if (a.stargazers_count > b.stargazers_count)
				return -1 // a first, then b
			if (a.stargazers_count < b.stargazers_count)
				return 1 // b first, then a
			return 0
		}
		allRepositories = allRepositories.sort(compareStars) // https://svelte.dev/tutorial/updating-arrays-and-objects
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
		allRepositories = allRepositories.sort(compareStars) // https://svelte.dev/tutorial/updating-arrays-and-objects
		updateFilteredRepositories()
	}

	let excluded_topics = []
	const excludeTopicToggle = event => {
		const topic = event.target.innerText // https://stackoverflow.com/a/68455563/9157799
		if (!excluded_topics.includes(topic)) // if topic not excluded yet, exclude
			excluded_topics = [...excluded_topics, topic] // https://svelte.dev/tutorial/updating-arrays-and-objects
		else // if already excluded, remove from excluded_topics
			excluded_topics = excluded_topics.filter(topic => topic !== event.target.innerText) // TODO: AMBIGU TOPIC https://stackoverflow.com/a/44433050/9157799
		updateTotalExcluded() // because there's no button to re-assign totalExcluded (Svelte's reactivity is triggered by assignments)
		updateFilteredRepositories()
	}

	let totalExcluded = 0
	const updateTotalExcluded = () => {
		let count = 0
		allRepositories.forEach(repository => {
			if (repository.topics.some(topic => excluded_topics.includes(topic))) // if the repo topics is in excluded topics | https://stackoverflow.com/q/16312528/9157799
				count++
		})
		totalExcluded = count
	}
</script>

<main class="max-w-3xl mx-auto">
	<h1>GitHub Top 1000 Repositories</h1>

	<div class="max-w-3xl mx-auto">
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

	{#if filteredRepositories.length == 0} <!-- https://stackoverflow.com/a/66080028/9157799 | https://svelte.dev/docs#template-syntax-await -->
		<p>Hang on..</p>
	{:else}
		{1000-totalExcluded} result, {totalExcluded} dimmed.
		<div class='flex flex-col gap-5'>
			{#each filteredRepositories as repository, i (repository.id)} <!-- the key (repository.id) is to fix the performance | https://svelte.dev/docs#template-syntax-each -->
				<div class="flex {repository.topics.some(topic => excluded_topics.includes(topic)) && 'opacity-50'}"> <!-- dim if topics is in excluded_topics | https://stackoverflow.com/q/16312528/9157799 -->
					<div class="w-10 text-right shrink-0 mr-3 text-gray-700"> <!-- number | shrink: https://stackoverflow.com/a/45741742/9157799 -->
						{i+1}
					</div>
					<div class='grow flex flex-col gap-1'> <!-- the rest | grow against number -->
						<div> <!-- the div prevent the whitespace from becoming a clickable link -->
							<a href="{repository.html_url}" class="text-blue-600">{repository.full_name}</a>
						</div>
						<div class="text-sm text-gray-800">{repository.description}</div>
						{#if repository.topics.length > 0} <!-- topics | if clause to prevent parent's flex gap -->
							<div class="flex flex-wrap gap-1">
								{#each repository.topics as topic}
									<div on:click={excludeTopicToggle} class="cursor-pointer rounded-full bg-sky-100 px-2 py-1 text-xs text-blue-500 {excluded_topics.includes(topic) && 'line-through'}">{topic}</div>
								{/each}
							</div>
						{/if}
						<div class='flex flex-wrap gap-x-4 text-xs text-gray-600'> <!-- last_commit_date & PRs thumbs up -->
							<StargazersCount stargazers_count={repository.stargazers_count}/>
							<Top5PRThumbsUp top_5_pr_thumbs_up={repository.top_5_pr_thumbs_up}/>
							<LastCommitDate last_commit_date={repository.last_commit_date}/>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</main>

<script>
	import { onMount } from 'svelte'; // https://stackoverflow.com/a/74165772/9157799

	onMount(async () => { // https://stackoverflow.com/a/74165772/9157799
		repositoriesP = fetchRepositories() // https://stackoverflow.com/a/66080028/9157799
		repositoriesP.then(r => repositories = r).then(sortByStars)
	})

	const fetchRepositories = async () => {
		const response = await fetch('http://localhost:3000/repositories')
		const repositories = await response.json()
		return repositories
	}

	let repositories = [] // https://stackoverflow.com/q/61105696/9157799#comment108104142_61105696
	let repositoriesP

	const sortByStars = () => {
		const compareStars = (a, b) => { // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
			if (a.stargazers_count > b.stargazers_count)
				return -1 // a first, then b
			if (a.stargazers_count < b.stargazers_count)
				return 1 // b first, then a
			return 0
		}
		repositories = repositories.sort(compareStars) // https://svelte.dev/tutorial/updating-arrays-and-objects
	}

	const readableNumber = number => { // https://stackoverflow.com/a/60988355/9157799
		const formatter = Intl.NumberFormat('en', {
			notation: 'compact',
			maximumFractionDigits: 1 // force 1 fraction digit
		})
		let result = formatter.format(number)
		return result.toLowerCase()
	}

	let excluded_topics = ["oi"]
	const excludeTopic = event => {
		excluded_topics = [...excluded_topics, event.target.innerText] // https://svelte.dev/tutorial/updating-arrays-and-objects | https://stackoverflow.com/a/68455563/9157799
	}
</script>

<h1>Welcome to SvelteKit</h1>

<div class="max-w-3xl mx-auto">
	Sort by:
	<button on:click={sortByStars}>
		stars
	</button>
</div>

<p>{excluded_topics.toString()}</p>

{#await repositoriesP} <!-- https://stackoverflow.com/a/66080028/9157799 | https://svelte.dev/docs#template-syntax-await -->
	<p>Hang on..</p>
{:then}
	wow
	{#each repositories as repository, i} <!-- https://svelte.dev/docs#template-syntax-each -->
		<div class="flex max-w-3xl mx-auto">
			<div class="w-10 text-right shrink-0 mr-3"> <!-- number | shrink: https://stackoverflow.com/a/45741742/9157799 -->
				{i+1}
			</div>
			<div class="grow"> <!-- the rest -->
				<div class="flex"> <!-- repo name & stars -->
					<div class="grow"> <!-- if we grow the <a>, the white space after the text will be clickable -->
						<a href="{repository.html_url}" class="text-blue-600">{repository.full_name}</a>
					</div>
					<div>{readableNumber(repository.stargazers_count)}</div>
				</div>
				<div class="">{repository.description}</div>
				{#if repository.topics.length > 0} <!-- mt-1 only if there's a topic -->
					<div class="flex flex-wrap gap-1 mt-1"> <!-- topics -->
						{#each repository.topics as topic}
							<div on:click={excludeTopic} class="cursor-pointer rounded-full bg-sky-100 px-2 pb-0.5 text-sm text-blue-500">{topic}</div>
						{/each}
					</div>
				{/if}
			</div>
		</div>
	{/each}
{/await}

<script>
	import { onMount } from 'svelte'; // https://stackoverflow.com/a/74165772/9157799

	let repositoriesPromise = [] // https://stackoverflow.com/q/61105696/9157799#comment108104142_61105696

	const fetchRepositories = async () => {
		const response = await fetch('http://localhost:3000/repositories')
		const repositories = await response.json()
		return repositories
	}

	onMount(async () => { //  // https://stackoverflow.com/q/70486828/9157799
		repositoriesPromise = await fetchRepositories()
	})
</script>

<h1>Welcome to SvelteKit</h1>
<p>Helloooo</p>

{#await repositoriesPromise then repositories} <!-- https://svelte.dev/docs#template-syntax-await -->
	<!-- {JSON.stringify(repositories)} -->
	{#each repositories as repository, i} <!-- https://svelte.dev/docs#template-syntax-each -->
		<div class="flex max-w-3xl mx-auto">
			<div class="w-10 flex"> <!-- number -->
				<div>{i+1}</div>
			</div>
			<div class="grow"> <!-- the rest -->
				<div class="flex"> <!-- repo name & stars -->
					<div class="grow">
						<a href="{repository.html_url}" class="text-blue-600">{repository.full_name}</a>
					</div>
					<div>{repository.stargazers_count}</div>
				</div>
				<div class="">{repository.description}</div>
				<div class="flex flex-wrap gap-1"> <!-- topics -->
					{#each repository.topics as topic}
						<div class="rounded-full bg-sky-100 px-2 pb-0.5 text-sm text-blue-500">{topic}</div>
					{/each}
				</div>
			</div>
		</div>
	{/each}
{/await}

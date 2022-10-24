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
		<div>
			<div> <!-- number -->
				{i+1}
			</div>
			<div> <!-- the rest -->
				<div> <!-- repo name & stars -->
					<div>{repository.full_name}</div>
					<div>{repository.stargazers_count}</div>
				</div>
				<p>{repository.description}</p>
				<div> <!-- topics -->
					{repository.topics}
				</div>
			</div>
		</div>
	{/each}
{/await}

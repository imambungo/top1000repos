<script>
	import { onMount } from 'svelte'; // https://stackoverflow.com/a/74165772/9157799

	let repositoriesPromise = []

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
	{#each repositories as repository}
		{repository.full_name}
	{/each}
{/await}

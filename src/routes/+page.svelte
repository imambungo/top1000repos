<script>
	import { onMount } from 'svelte'; // https://stackoverflow.com/a/74165772/9157799

	let repositoriesPromise = null

	onMount(async () => { //  // https://stackoverflow.com/q/70486828/9157799
		const response = await fetch('http://localhost:3000/repositories')
		const repositories = await response.json()
		repositoriesPromise = repositories
	})
</script>

<h1>Welcome to SvelteKit</h1>
<p>Helloooo</p>

{#await repositoriesPromise then repositories} <!-- https://svelte.dev/docs#template-syntax-await -->
	{JSON.stringify(repositories)}
{/await}

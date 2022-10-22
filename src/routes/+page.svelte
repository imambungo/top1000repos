<script>
	const fetchRepositories = async () => {
		const response = await fetch('http://localhost:3000/repositories') // https://stackoverflow.com/q/70486828/9157799
		const repositories = await response.json()
		return repositories
	}
	const repositoriesPromise = fetchRepositories()
</script>

<h1>Welcome to SvelteKit</h1>
<p>Helloooo</p>

{#await repositoriesPromise then repositories}
	{JSON.stringify(repositories)}
{/await}

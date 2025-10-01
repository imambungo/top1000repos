export function entries() { // https://kit.svelte.dev/docs/page-options#prerender-troubleshooting
	return [
		{ optional_parameter: 'sorted-by-pr' },
		{ optional_parameter: 'sorted-by-issues' },
		{ optional_parameter: 'sorted-by-code-size' },
		{ optional_parameter: 'sorted-by-project-size' },
		{ optional_parameter: 'sorted-by-repo-size' }
	];
}
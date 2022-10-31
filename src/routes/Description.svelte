<script>
	export let description
</script>

<div class="text-sm text-gray-800 line-clamp-4"> <!-- https://stackoverflow.com/a/41137262/9157799 | https://tailwindcss.com/docs/plugins#line-clamp -->
	{description ? description : ''} <!-- if null, empty string -->
</div>
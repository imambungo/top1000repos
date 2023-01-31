<script>
	export let promise //  emoji_image_urls
	export let description

	const replace_emoji_codes_with_actual_emojis = (description, emoji_image_urls) => {
		Object.keys(emoji_image_urls).forEach(literal => {
			description = description.replaceAll(`:${literal}:`, `<img class="h-4 inline-block align-text-bottom" alt="${literal}" src="${emoji_image_urls[literal]}">`)
		})
		return description
	}
</script>

{#await promise then emoji_image_urls}
	<div class="text-sm text-gray-800 line-clamp-4"> <!-- https://stackoverflow.com/a/41137262/9157799 | https://tailwindcss.com/docs/plugins#line-clamp -->
		{@html description ? replace_emoji_codes_with_actual_emojis(description, emoji_image_urls) : ''} <!-- https://stackoverflow.com/q/57580013/9157799 | if null, empty string -->
	</div>
{/await}
<script>
	export let promise //  emoji_image_urls
	export let description // watch out, some description is null
	$: splitted_description = description?.split(/(:[^ :]+:)/) // to differentiate the emoji markups | https://stackoverflow.com/a/4514223/9157799

	import Emoji from './Emoji.svelte'

	// const replace_emoji_codes_with_actual_emojis = (description, emoji_image_urls) => {
	// 	Object.keys(emoji_image_urls).forEach(literal => {
	// 		description = description.replaceAll(`:${literal}:`, `<img class="h-4 inline-block align-text-bottom" alt="${literal}" src="${emoji_image_urls[literal]}">`)
	// 	})
	// 	return description
	// }
	const is_emoji = (normal_text_or_emoji_markup, emoji_image_urls) => {
		Object.keys(emoji_image_urls).forEach(literal => { // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
			if (normal_text_or_emoji_markup == `:${literal}:`)
				console.log(`TRUE ${normal_text_or_emoji_markup}`)
				return true
		});
		console.log(`FALSE ${normal_text_or_emoji_markup}`)
		return false
	}
</script>

{#await promise then emoji_image_urls}
	{#if description} <!-- some description is null -->
		<div class="text-sm text-gray-800 line-clamp-4"> <!-- https://stackoverflow.com/a/41137262/9157799 | https://tailwindcss.com/docs/plugins#line-clamp -->
			{#each splitted_description as normal_text_or_emoji_markup}
				{#if is_emoji(normal_text_or_emoji_markup, emoji_image_urls)}
					<Emoji literal={normal_text_or_emoji_markup.replaceAll(':', '')} emoji_image_urls={emoji_image_urls}/>
				{:else}
					{normal_text_or_emoji_markup}
				{/if}
			{/each}
			<!-- {@html description ? replace_emoji_codes_with_actual_emojis(description, emoji_image_urls) : ''} https://stackoverflow.com/q/57580013/9157799 | if null, empty string -->
		</div>
	{/if}
{/await}
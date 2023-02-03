<script>
	export let promise //  emoji_image_urls
	export let description // watch out, some description is null
	$: splitted_description = description?.split(/(:[^ :]+:)/) // to differentiate the emoji markups | https://stackoverflow.com/a/4514223/9157799

	import Emoji from './Emoji.svelte'

	const is_emoji = (normal_text_or_emoji_markup, emoji_image_urls) => {
		//return emoji_image_urls[normal_text_or_emoji_markup]

		if (emoji_image_urls[normal_text_or_emoji_markup.replaceAll(':', '')]) {
			return true
		}
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
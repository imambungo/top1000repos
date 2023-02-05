<script>
	export let promise //  emoji_image_urls
	export let description // watch out, some description is null
	$: splitted_description = description?.split(/(:[^ :]+:)/) // to differentiate the emoji markups | https://stackoverflow.com/a/4514223/9157799

	import Emoji from './Emoji.svelte'

	const is_emoji = (normal_text_or_emoji_markup, emoji_image_urls) => {
		return emoji_image_urls[ normal_text_or_emoji_markup.replaceAll(':', '') ]
	}
</script>

{#await promise then emoji_image_urls}
	{#if description} <!-- some description is null -->
		<div class="text-sm text-gray-800 line-clamp-6 break-words"> <!-- https://stackoverflow.com/a/41137262/9157799 | https://tailwindcss.com/docs/plugins#line-clamp | https://stackoverflow.com/a/75308868/9157799 -->
			{#each splitted_description as normal_text_or_emoji_markup}
				{#if is_emoji(normal_text_or_emoji_markup, emoji_image_urls)}
					<Emoji literal={normal_text_or_emoji_markup.replaceAll(':', '')} emoji_image_urls={emoji_image_urls}/>
				{:else}
					{normal_text_or_emoji_markup}
				{/if}
			{/each}
		</div>
	{/if}
{/await}
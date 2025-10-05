<script>
   let {
      sort_option, href, button_option,
      children // https://svelte.dev/docs/svelte/snippet#Passing-snippets-to-components
   } = $props()

   import { num_of_repos_to_render } from './num_of_repos_to_render.svelte.js'

   const needed_when_using_a_instead_of_button = 'inline-block'
</script>

<a
  data-sveltekit-replacestate
  href='{href}'
  class='{needed_when_using_a_instead_of_button} px-4 py-1 rounded-lg border tracking-tight {sort_option.option == button_option ? 'bg-gray-500 text-white cursor-default' : 'text-gray-500'}'
  onclick={() => {
     num_of_repos_to_render.value = 50
     num_of_repos_to_render.increase_gradually({by: 10, until: 1000, every_milliseconds: 80})
  }}
> <!-- https://kit.svelte.dev/docs/link-options#data-sveltekit-replacestate -->
   <span class='{sort_option.option == button_option ? "drop-shadow-[0_0_0.6px_rgba(256,256,256,0.5)]" : ""}'> <!-- https://stackoverflow.com/a/74753353/9157799 -->
      {@render children?.()} <!-- https://svelte.dev/docs/svelte/@render#Optional-snippets -->
   </span>
</a>
<script>
   let scrollY = 0  // window.scrollY | https://svelte.dev/tutorial/svelte-window-bindings | svelte can't detect window "undefined" if we try to use window.scrollY directly
   let md_screen_sticky_options // https://svelte.dev/tutorial/bind-this
   let md_screen_sticky_options_distance_to_top = 0
   $: {
      let trigger = scrollY
      md_screen_sticky_options_distance_to_top = md_screen_sticky_options?.getBoundingClientRect().top || 0  // https://stackoverflow.com/a/35571753/9157799
   }
</script>

<svelte:window bind:scrollY/> <!-- https://svelte.dev/tutorial/svelte-window-bindings -->

<div class="text-sm sticky top-0 py-4 flex flex-col gap-4 overflow-y-auto" style="max-height: calc(100vh - {md_screen_sticky_options_distance_to_top}px)" bind:this={md_screen_sticky_options}> <!-- Tailwind doesn’t include any sort of client-side runtime, so class names need to be statically extractable at build-time, and can’t depend on any sort of arbitrary dynamic values that change on the client. Use inline styles for these situations.: https://v2.tailwindcss.com/docs/just-in-time-mode | be careful with calc(): https://stackoverflow.com/q/34419813/9157799 | https://svelte.dev/tutorial/bind-this -->
   <slot></slot>
</div>
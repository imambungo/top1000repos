<script>
   let { children } = $props();
   let scrollY = $state(0)  // window.scrollY | https://svelte.dev/tutorial/svelte-window-bindings
   let viewport_height = $state(0) // window.innerHeight | svelte can't detect window "undefined" if we try to use window.innerHeight directly (ups.. we can, in onMount (window or navigator is not found at server side))
   let element = $state() // https://svelte.dev/tutorial/bind-this
   let max_height = $state(99999)
   $effect(() => {
      let trigger = scrollY
      if (element != null) {
         let element_distance_to_viewport_top = element.getBoundingClientRect().top // https://stackoverflow.com/a/35571753/9157799
         if (element_distance_to_viewport_top < 0) // need to be capped at 0 because when element height is >= viewport_height, when the page is scrolled to the bottom, some of the top part of the element get moved above (offset) causing negative value which will mess the calculation up
            element_distance_to_viewport_top = 0 // will be > 0 when element not "sticky" yet
         
         let in_viewport_footer_height = viewport_height - element.parentNode.getBoundingClientRect().bottom // https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect
         if (in_viewport_footer_height <= 0) // still below viewport
            in_viewport_footer_height = 0 // will be > 0 when the footer (the element below) is inside the viewport
         
         max_height = viewport_height - element_distance_to_viewport_top - in_viewport_footer_height
      }
   })
</script>

<svelte:window bind:scrollY bind:innerHeight={viewport_height}/> <!-- https://svelte.dev/tutorial/svelte-window-bindings -->

<div class="text-sm sticky top-0 py-4 flex flex-col gap-4 overflow-y-auto" style="max-height: {max_height}px" bind:this={element}> <!-- Tailwind doesn’t include any sort of client-side runtime, so class names need to be statically extractable at build-time, and can’t depend on any sort of arbitrary dynamic values that change on the client. Use inline styles for these situations.: https://v2.tailwindcss.com/docs/just-in-time-mode | be careful with calc(): https://stackoverflow.com/q/34419813/9157799 | https://svelte.dev/tutorial/bind-this -->
   {@render children?.()} <!-- https://svelte.dev/docs/svelte/@render#Optional-snippets -->
</div>
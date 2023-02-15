<script>
   import { createEventDispatcher } from 'svelte'; // https://svelte.dev/tutorial/component-events
   const dispatch = createEventDispatcher(); // https://svelte.dev/tutorial/component-events

   export let numbering
</script>

<div class='flex flex-col gap-1'>
   <p class='text-gray-600 text-xs font-medium'>Numbering</p>
   <div class='bg-gray-300 rounded-full p-0.5 w-fit font-semibold text-xs text-white'>
      <button class='px-4 py-1 tracking-tight {numbering == 'rank' ? 'rounded-full bg-gray-50 text-gray-500 hover:cursor-default' : ''}' on:click={ () => dispatch('change', {numbering: 'rank'}) }> <!-- emit on:change event | // https://svelte.dev/tutorial/component-events -->
         Rank
      </button>
      <button class='px-4 py-1 tracking-tight {numbering == 'order' ? 'rounded-full bg-gray-50 text-gray-500 hover:cursor-default' : ''}' on:click={() => dispatch('change', {numbering: 'order'}) }>
         Order
      </button>
   </div>
</div>
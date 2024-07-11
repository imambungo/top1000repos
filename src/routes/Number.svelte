<script>
   export let numbering
   export let rank
   export let order
</script>

<div class="text-sm pt-0.5 w-8 shrink-0 mr-2 text-gray-700 flex justify-end md:ml-0"> <!-- number | shrink: https://stackoverflow.com/a/45741742/9157799 -->
   {#if numbering == 'rank'}
      <p>{rank}</p>
   {:else}
      <p>{order}</p>
   {/if}
</div>
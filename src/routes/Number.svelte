<script>
   export let numbering
   export let rank
   export let order
</script>

<div class="w-10  shrink-0 mr-3 text-gray-700 flex justify-end"> <!-- number | shrink: https://stackoverflow.com/a/45741742/9157799 -->
   {#if numbering == 'rank'}
      <p title='rank based on the number of stars'>
         {rank}
      </p>
   {:else}
      <p title='numbering based on order'>
         {order}
      </p>
   {/if}
</div>
<script>
   export let numbering
   export let rank
   export let order
</script>

<div class="text-sm pt-0.5 w-8 shrink-0 mr-2 text-gray-700 flex justify-end -ml-3"> <!-- number | shrink: https://stackoverflow.com/a/45741742/9157799 | negative left margin to compensate root left margin -->
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
<script>
   export let numbering
   export let rank
   export let order
</script>

{#if numbering == 'rank'}
   <p>{rank}</p>
{:else}
   <p>{order}</p>
{/if}
<script>
   let { numbering, rank, order } = $props();
</script>

{#if numbering == 'rank'}
   <p>{rank}</p>
{:else}
   <p>{order}</p>
{/if}
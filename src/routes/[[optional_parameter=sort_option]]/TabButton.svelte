<script>
   let { button_tab, current_tab, content, shrunken_content } = $props()
</script>

<li class="mr-2">
   {#if current_tab.tab == button_tab}
      <a href="#top" class="p-4 border-b-2 text-gray-700 border-blue-500 inline-block" aria-current="page">{content}</a>
   {:else}
      <a href="#top" class="p-4 border-b-2 text-gray-500 hover:text-gray-600 hover:border-gray-300 hidden sm:inline-block" onclick={() => current_tab.tab = button_tab}>{content}</a>
      <a href="#top" class="p-4 border-b-2 text-gray-500 hover:text-gray-600 hover:border-gray-300 inline-block sm:hidden" onclick={() => current_tab.tab = button_tab}>{shrunken_content}</a>
   {/if}
</li>
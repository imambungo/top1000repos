<script>
   let { handleChange, numbering } = $props();
</script>

<div class='flex flex-col gap-1'>
   <p class='text-gray-600 text-xs font-medium'>Numbering</p>
   <div class='bg-gray-300 rounded-full p-0.5 w-fit font-semibold text-xs text-white'>
      <button class='px-4 py-1 tracking-tight {numbering == 'rank' ? 'rounded-full bg-gray-50 text-gray-500 hover:cursor-default' : ''}' onclick={() => handleChange('rank')}>
         Normal
      </button>
      <button class='px-4 py-1 tracking-tight {numbering == 'order' ? 'rounded-full bg-gray-50 text-gray-500 hover:cursor-default' : ''}' onclick={() => handleChange('order')}>
         Order
      </button>
   </div>
</div>
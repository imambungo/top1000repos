<script>
	export let description
</script>

<div class="text-sm text-gray-800">
	{description ? description : ''} <!-- if null, empty string -->
</div>
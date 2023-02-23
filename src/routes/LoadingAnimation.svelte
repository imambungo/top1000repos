<script>
   import { onMount } from 'svelte'; // https://svelte.dev/tutorial/bind-this

   let dots

   onMount(() => {  // https://svelte.dev/tutorial/bind-this
      let num_of_dots = 1
      let change_num_of_dots = () => { // https://www.geeksforgeeks.org/how-to-create-frame-by-frame-animation-using-css-and-javascript/
         dots.innerText = '.'.repeat(num_of_dots)
         num_of_dots++;
         if (num_of_dots > 3) num_of_dots = 0
      }
      change_num_of_dots() // https://stackoverflow.com/q/10563344/9157799
      const intervalID = setInterval(change_num_of_dots, 300) // https://developer.mozilla.org/en-US/docs/Web/API/setInterval

      return () => {
			clearInterval(intervalID);
		}
   })
</script>

<p>Hang on<span bind:this={dots}></span></p>
<script>
   let { code_size, project_size, repo_size } = $props()

   const readable_size = bytes => {
      if (bytes === null || bytes === undefined) return 'later'

      const base = 1000
      const one_kb = base ** 1
      const one_mb = base ** 2
      const one_gb = base ** 3

      const how_many_gb = bytes/one_gb
      const divisible_by_one_gb = how_many_gb >= 1
      if (divisible_by_one_gb) {
         if (how_many_gb >= 100) {
            return `${Math.round(how_many_gb)} gB`
         }
         if (how_many_gb >= 10) {
            let result = bytes/one_gb
            result = result.toFixed(1) // 1 decimal place
            result = parseFloat(result) // remove trailing .0
            return `${result} gB`
         }
         let result = bytes/one_gb
         result = result.toFixed(2) // 2 decimal places
         result = parseFloat(result) // remove trailing 0s
         return `${result} gB`
      }

      const how_many_mb = bytes/one_mb
      const divisible_by_one_mb = how_many_mb >= 1
      if (divisible_by_one_mb) {
         if (how_many_mb >= 100) {
            return `${Math.round(how_many_mb)} mB`
         }
         if (how_many_mb >= 10) {
            let result = bytes/one_mb
            result = result.toFixed(1) // 1 decimal place
            result = parseFloat(result) // remove trailing .0
            return `${result} mB`
         }
         let result = bytes/one_mb
         result = result.toFixed(2) // 2 decimal places
         result = parseFloat(result) // remove trailing 0s
         return `${result} mB`
      }

      const how_many_kb = bytes/one_kb
      const divisible_by_one_kb = how_many_kb >= 1
      if (divisible_by_one_kb) {
         if (how_many_kb >= 100) {
            return `${Math.round(how_many_kb)} kB`
         }
         if (how_many_kb >= 10) {
            let result = bytes/one_kb
            result = result.toFixed(1) // 1 decimal place
            result = parseFloat(result) // remove trailing .0
            return `${result} kB`
         }
         let result = bytes/one_kb
         result = result.toFixed(2) // 2 decimal places
         result = parseFloat(result) // remove trailing 0s
         return `${result} kB`
      }

      return `${bytes} B`
   }

   const readable_bytes = bytes => { // add underscore as thousands separator
      if (bytes === null || bytes === undefined) return ''
      const result = bytes.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "_")
      return `${result} bytes`
   }
</script>

<span class="flex">
   <span title='Detected as non-generated code by GitHub' class='cursor-help'>Code</span>
   <span class='text-gray-400'>/</span>
   <span title='Size of the project at the latest commit of the default branch' class='cursor-help'>project</span>
   <span class='text-gray-400'>/</span>
   <span title='Whole repo (compressed git objects)' class='cursor-help'>repo</span>
   size:
   <a href='https://ux.stackexchange.com/a/153971/164746' target='_blank' class='tracking-tight' title='{readable_bytes(code_size)}'>{readable_size(code_size)}</a>
   <span class='text-gray-400 mx-0.5'>/</span>
   <a href='https://ux.stackexchange.com/a/153971/164746' target='_blank' class='tracking-tight' title='{readable_bytes(project_size)}'>{readable_size(project_size)}</a>
   <span class='text-gray-400 mx-0.5'>/</span>
   <a href='https://ux.stackexchange.com/a/153971/164746' target='_blank' class='tracking-tight' title='{readable_bytes(repo_size)}'>{readable_size(repo_size)}</a>
</span>
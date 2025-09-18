const create_visible_chain_link = () => {
   let index = $state(-1)

   return {
      get index() { return index },
      set index(idx) { index = idx }
   }
}

export const visible_chain_link = create_visible_chain_link() // a singleton: https://nodejs.org/docs/latest/api/modules.html#caching
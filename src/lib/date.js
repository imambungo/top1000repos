export const a_year_ago = () => {
   const date = new Date()
   date.setDate(date.getDate() - 365) // https://stackoverflow.com/a/13838662/9157799
   return date.toISOString().slice(0, 10) // https://stackoverflow.com/a/35922073/9157799
}

export const today = () => {
   return new Date().toISOString().slice(0, 10) // https://stackoverflow.com/a/35922073/9157799
}
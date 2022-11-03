export const local_storage = {
   getItem: key => JSON.parse(localStorage.getItem(key)),
   setItem: (key, value) => localStorage.setItem(key, JSON.stringify(value))
}

export const session_storage = {
   getItem: key => JSON.parse(sessionStorage.getItem(key)),
   setItem: (key, value) => sessionStorage.setItem(key, JSON.stringify(value))
}
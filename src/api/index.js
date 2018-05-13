function fetchItem (id) {
  id = id + ''
  if (id === '') {
    id = '0'
  }
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve([id, id + id,id + id + id])
    }, 500)
  })
}

export {
  fetchItem
}
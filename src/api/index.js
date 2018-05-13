function fetchItem (id) {
  id = id + ''
  if (id === '') {
    id = '0'
  }
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve([id, id + id,id + id + id])
    }, 1000)
  })
}

export {
  fetchItem
}
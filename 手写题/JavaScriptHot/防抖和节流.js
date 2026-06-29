function debounce(callback, wait){
  let timer = null
  return function(...args){
    if (timer) {
      clearTimeout(timer)
    }
    setTimeout(() => callback(...args), wait)
  }
}

function throttle(callback, delay){
  let currentTime = Date.now()
  return function(...args){
    if (Date.now() - currentTime >= delay){
      callback(...args)
      currentTime = Date.now()
    }
  }
}
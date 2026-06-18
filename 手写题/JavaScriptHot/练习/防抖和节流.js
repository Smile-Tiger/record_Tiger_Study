function debounce(callback, wait){
  let timer = null
  return function(...args){
    if(timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => callback(...args), wait)
  }
}

function throttle(callback, delay){
  let currentTime = Date.now()
  return function(...args){
    let nowTime = Date.now()
    if(nowTime - currentTime > delay) {
      callback(...args)
      currentTime = Date.now()
    }
  }
}
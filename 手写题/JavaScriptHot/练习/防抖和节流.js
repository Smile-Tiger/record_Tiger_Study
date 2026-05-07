function debounce(callback, wait){
  let timer = null
  return function(...args){
    if(timer) {
      clearTimeout(timer)
      timer = null
    }
    timer = setTimeout(() => callback(...args), wait)
  }
}

function throttle(fn, delay){
  let currentTime = Date.now()
  return function(...args){
    let nowTime = Date.now()
    if(nowTime - currentTime > delay){
      fn(...args)
      currentTime = Date.now()
    }
  }
}
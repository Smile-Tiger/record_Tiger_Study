function debounce(callback, time) {
    let timer = null;
    return (...args) => {
      if (timer) {
        clearTimeout(timer)
        timer = null
      }
      timer = setTimeout(() => {
        callback(...args)
      }, time);
    }
  }

function throttle(fn, delay) {
    let currentTime = Date.now()
    return (...args) => {
      nowTime = Date.now()
      if (nowTime - currentTime > delay) {
        fn(...args)
        currentTime = Date.now()
      }
    }
  }
// 写一个简单的++和--计数器
function createCounter() {
  let count = 0
  return {
    add(){ count++ },
    del(){ count-- },
    get(){ console.log(count) }
  }
}
const counter = createCounter()
counter.add()
counter.get()

// 手写一个防抖函数
function debounce(fn, wait){
  let timer = null
  return function(...args){
    if(timer){
      clearTimeout(timer)
      timer = null
    }
    timer = setTimeout(() => fn.apply(this, args), wait)
  }
}
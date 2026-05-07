function myCurrying(fn){
  return function curried(...args){
    if(curried.length >= fn.length) {
      return fn.apply(this, args)
    } else {
      return function(...args2){
        return curried.apply(this, [...args, ...args2])
      }
    }
  }
}
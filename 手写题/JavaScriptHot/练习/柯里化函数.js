function myCurrying(fn){
  return function curried(...args){
    if (args.length > fn.length){
      return fn.apply(this, args)
    }
    else {
      return function (...args2) {
        return fn.apply(this, args.concat(args2))
      }
    }
  }
}

function sum(a, b, c) {      // ← sum.length = 3
  return a + b + c;
}
const fn = myCurrying(sum) // 声明的时候this指向未知
const _fn = fn(1) // 只有在调用的时候，this根据调用的方式决定指向
console.log(_fn)
const result = _fn(2, 3)
console.log(result)
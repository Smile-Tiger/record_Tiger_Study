// 请手写一下函数bind/call/apply的方法
Function.prototype.myCall = function(obj, ...args){
  obj = (obj === undefined || obj === null) ? window : obj
  obj.__fn = this
  let result = obj.__fn(...args)
  delete obj.__fn
  return result
}

Function.prototype.myApply = function(obj, args){
  obj = (obj === null || obj === undefined) ? window : obj
  obj.__fn = this
  let result = obj.__fn(...args)
  delete obj.__fn
  return result
}

Function.prototype.myBind = function(obj, ...args1){
  obj = (obj === null || obj === undefined) ? window : obj
  let _this = this
  return function(...args2){
    obj.__fn = _this
    let result = obj.__fn(...[...args1, ...args2])
    delete obj.__fn
    return result
  }
}
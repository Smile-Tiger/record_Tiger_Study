// 请手写一下函数bind/call/apply的方法
Function.prototype.call = function(context, ...args){
  context = (context === undefined || context === null) ? window : context
  context.__fn = this
  let result = context.__fn(...args)
  delete context.__fn
  return result
}

Function.prototype.apply = function(context, args){
  context = (context === undefined || context === null) ? window : context
  context.__fn = this
  let result = context.__fn(...args)
  delete context.__fn
  return result
}

Function.prototype.bind = function (context, ...args1){
  context = (context === undefined || context === null) ? window : context
  _this = this
  return function(...args2){
    context.__fn = _this
    let result = context.__fn(...[...args1, ...args2])
    delete context.__fn
    return result
  }
}
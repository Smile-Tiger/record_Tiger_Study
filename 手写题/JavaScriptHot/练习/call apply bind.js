// 请手写一下函数bind/call/apply的方法
Function.prototype.call = (context, ...args) => {
  context = (context === undefined || context === null) ? window : context
  context.__fn = this
  const result = context.__fn(...args)
  delete context.__fn
  return result
}

Function.prototype.apply = (context, args) => {
  context = (context === undefined || context === null) ? window : context
  context.__fn = this
  const result = context.__fn(...args)
  delete context.__fn
  return result
}

Function.prototype.bind = (context, ...args1) => {
  context = (context === undefined || context === null) ? window : context
  const __this = this
  return function (...args2) {
    context.__fn = __this
    const result = context.__fn(...[...args1, ...args2])
    delete context.__fn
    return result
  }
}
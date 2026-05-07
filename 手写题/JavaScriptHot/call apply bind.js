// - call / apply ：单次调用，临时改变 this，执行完就恢复
// - bind ：返回新函数，永久绑定 this，可以多次调用
// - call传多个参数，apply传数组
Function.prototype.call2 = function(context, ...args) {
  context = (context === undefined || context === null) ? window : context
  context.__fn = this
  let result = context.__fn(...args)
  delete context.__fn
  return result
}
Function.prototype.apply2 = function(context, args) {
  context = (context === undefined || context === null) ? window : context
  context.__fn = this
  let result = context.__fn(...args)
  delete context.__fn
  return result
}
// args1是预设数组数据，args2是后续需要传的一些数据，然后两个会合并在一起，
// 所以说可以提前给方法提供一些数据
Function.prototype.bind2 = function(context, ...args1) {
  context = (context === undefined || context === null) ? window : context
  let _this = this // 利用闭包永久保存函数
  return function(...args2) {
    context.__fn = _this
    let result = context.__fn(...[...args1, ...args2])
    delete context.__fn
    return result
  }
}
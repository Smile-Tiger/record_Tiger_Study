Object.myCreate = function(proto){
  if (typeof proto !== 'object' && typeof proto !== 'function'){
    throw new TypeError('proto必须为对象或者函数')
  } else if (typeof proto === null){
    throw new Error('浏览器中不支持传递null')
  }

  function F() {}
  F.prototype = proto
  return new F()
}
const _completeDeepClone = (target, map = new WeakMap()) => {
  // - 如果不是对象（string/number/boolean等），直接返回
  // - null 的 typeof 也是 'object'，所以要单独判断
  if (typeof target !== 'object' || target === null) return target
  if (map.has(target)) {
    return map.get(target)  // 返回已拷贝的对象
  }
  const constructor = target.constructor // 拿到target的构造函数，通过原型链向上查找
  // 特殊处理特殊的对象
  // /^(Function|RegExp|Date|Map|Set)$/i 正则表达式，匹配这些类型名
  // ^$ 开头和结尾，完整匹配
  // i 忽略大小写
  if (/^(Function|RegExp|Date|Map|Set)$/i.test(constructor.name)) return new constructor(target)
  // map标记每一个出现过的属性，避免循环引用重复拷贝，保证循环引用的属性只拷贝一次
  const cloneTarget = Array.isArray(target) ? [] : {}
  map.set(target, cloneTarget) 
  for (prop in target) {
    // hasOwnProperty是判断是否为自身的属性，而非继承或原型链的属性
    if (target.hasOwnProperty(prop)) {
      cloneTarget[prop] = _completeDeepClone(target[prop], map)
    }
  }
  return cloneTarget
}

const obj = {
  name: '张三',
  friend: null,  // 先设为 null
}
obj.friend = obj  // 循环引用
obj.age = 25      // 还有另一个属性

const newObj = _completeDeepClone(obj)
console.log(newObj)
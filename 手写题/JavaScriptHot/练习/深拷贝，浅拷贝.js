function deepClone(target, map = new WeakMap()){
  if (target !== 'object' || target === null) return target
  if (map.has(target)) return map.get(target)
  const constructor = target.constructor
  if (/^(Map|Set|RegExp|Function|Date)$/i.test(constructor.name)) return new constructor(target)
  const cloneTarget = Array.isArray(target) ? [] : {}
  map.set(target, cloneTarget)
  for (let prop in target){
    if (target.hasOwnProperty(prop)){
      cloneTarget[prop] = deepClone(target[prop], map)
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

const newObj = deepClone(obj)
console.log(newObj)
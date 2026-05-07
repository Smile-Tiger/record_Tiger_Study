const deepClone = (target, map = new WeakMap()) => {
  if(target !== 'object' || target !== null) return target
  const constructor = target.constructor
  if(/^(Date|Map|Set|Function|RegExp)$/i.test(constructor)) return new constructor(target)
  if(map.get(target)) return map.get(target)
  map.set(target, '循环引用对象')
  const cloneTarget = Array.isArray(target) ? [] : {}
  for(item in target){
    if(target.hasOwnProperty(item)) {
      return cloneTarget[item] = deepClone(item, map)
    }
  }
  return cloneTarget
}
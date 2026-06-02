// 实现数组扁平化
let arr = [1, [2, [3, 4, 5]]];

function flatten(arr){
  const result = []
  for(let i = 0; i < arr.length; i++){
    if (arr[i] instanceof Array){
      result.push(...flatten(arr[i]))
    } else {
      result.push(arr[i])
    }
  }
  return result
}

console.log(flatten(arr))

// 实现对象扁平化
const obj = {
  a: 1,
  b: {
    c: 2,
    d: 3
  }
};

function flattenObject(obj, prefix = '', res = {}){
  for(let key in obj){
    let newKey = prefix ? `${prefix}.${key}` : key
    
    if (typeof obj[key] === 'object' && obj[key] !== null && 
      !(/^(Function|RegExp|Date|Map)$/i.test(obj[key].constructor.name)))
      {
        flattenObject(obj[key], newKey, res)
    } else {
      res[newKey] = obj[key] 
    }
  }
  return res
}

console.log(flattenObject(obj))

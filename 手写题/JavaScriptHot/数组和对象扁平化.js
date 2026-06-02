// 数组扁平化（递归）
let arr = [1, [2, [3, 4, 5]]];

function flatten(arr) {
  let result = [];
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] instanceof Array) {
      result = result.concat(flatten(arr[i]))
      // result.push(...flatten(arr[i])) 也可以写这一段
    } else {
      result.push(arr[i])
    }
  }
  return result;
}
flatten(arr);

// 对象扁平化（常用于路由扁平化）
const obj = {
  a: 1,
  b: {
    c: 2,
    d: 3
  }
};

function flattenObject(obj, prefix = '', res = {}) {
  for (let key in obj) {
    // 拼接新 key：有前缀就加 "."，没有就直接用
    let newKey = prefix ? `${prefix}.${key}` : key;
    // prefix='home', key='path' → newKey='home.path'
    // prefix='', key='home' → newKey='home'
    
    // obj还不能为特殊对象
    if (typeof obj[key] === 'object' && obj[key] !== null && 
      !(/^(Function|RegExp|Date|Map)$/i.test(obj[key].constructor.name))) { 
      flattenObject(obj[key], newKey, res);
    } else {
      res[newKey] = obj[key];
    }
  }
  return res;
}
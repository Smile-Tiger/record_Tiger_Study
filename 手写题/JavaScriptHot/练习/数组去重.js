// 请完成一下数组的去重操作
let arr = [1, 2, 3, 2, 1];

const array = [
  { id: 1, name: '张三' },
  { id: 2, name: '李四' },
  { id: 1, name: '张三' },  // id 重复
  { id: 3, name: '王五' }
];

// 普通数组去重
const arr1 = [...new Set(arr)]
const arr2 = arr.filter((item, index, array) => array.indexOf(item) === index)
const arr3 = arr.reduce((unique, item) => {
  return unique.includes(item) ? unique : [...unique, item]
}, [])

// 对象数组去重
const arr4 = [...new Map(array.map(item => [item.id, item])).values()]
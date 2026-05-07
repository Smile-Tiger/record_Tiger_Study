// 请完成一下数组的去重操作
let arr = [1, 2, 3, 2, 1];

const array = [
  { id: 1, name: '张三' },
  { id: 2, name: '李四' },
  { id: 1, name: '张三' },  // id 重复
  { id: 3, name: '王五' }
];

// 普通数组去重
let newArr1 = [...new Set(arr)]
// Array.from(new Set(arr))
let newArr2 = arr.filter((item, index, array) => array.indexOf(item) === index)
let newArr3 = arr.reduce((array, item) => {
  return array.includes(item) ? array : [...array, item]
}, [])

// 对象数组去重
let newArray = Array.from(new Map(arr.map((item) => [item.id, item])).values())
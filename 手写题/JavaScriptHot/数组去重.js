// 普通数组去重
// Set
let arr = [1, 2, 3, 2, 1];
let uniqueArr = [...new Set(arr)] // 展开运算符能展开普通对象，如果key值为数字且正常顺序可以转为数组
// 或者是Array.from(new Set(arr))
// filter（true保留，false去除）
let uniqueArr1 = arr.filter((item, index, array) => array.indexOf(item) === index);
// reduce
let arr1 = [1, 2, 3, 4, 5, 6];
const result = arr1.reduce((unique, item) => {
  return unique.includes(item) ? unique : [...unique, item]
  // 后面不能用push(item)因为push返回数组新长度
}, []);
console.log(result)
// map ES5+
const array = [1, 2, 3, 5, 1, 5, 9, 1, 2, 8];
function uniqueArray(array){
    let map = {}
    let res = []
    for(var i = 0; i < array.length; i++){
        if(!map.hasOwnProperty([array[i]])){
            map[array[i]] = i;
            res.push(array[i])
        }
    }
    return res;
}
uniqueArray(array);

// 对象数组去重
const arr2 = [
  { id: 1, name: '张三' },
  { id: 2, name: '李四' },
  { id: 1, name: '张三' },  // id 重复
  { id: 3, name: '王五' }
];

// 根据 id 去重
const unique = Array.from(
  new Map(arr.map(item => [item.id, item])).values()
);

console.log(unique);

// map后的结果
// [
//   [1, { id: 1, name: '张三' }],
//   [2, { id: 2, name: '李四' }],
//   [1, { id: 1, name: '张三' }]  // key 也是 1
// ]
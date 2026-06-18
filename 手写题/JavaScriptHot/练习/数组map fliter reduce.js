// 实现一下数组的map，filter，reduce方法
const array = [
  { id: 1, name: '张三' },
  { id: 2, name: '李四' },
  { id: 1, name: '张三' },  // id 重复
  { id: 3, name: '王五' }
]
// 可以参考自己假装在调用这些函数，去思考实现方法
const arr = arr.myMap((item) => item.id)
const arr2 = arr.myFilter((item) => item.name === '张三')
const arr3 = arr.reduce((array, item) => array.push(item.id), [])

Array.prototype.map = function (callback) {
  const res = []
  for (let i = 0; i < this.length; i++){
    res.push(callback(this[i], i, this))
  }
  return res
}

Array.prototype.myFilter = function (callback) {
  const res = []
  for (let i = 0; i < this.length; i++){
    if (callback(this[i], i, this)) res.push(this[i])
  }
  return res
}

Array.prototype.reduce = function (callback, )
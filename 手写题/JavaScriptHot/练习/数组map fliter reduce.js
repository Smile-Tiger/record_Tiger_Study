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
const arr3 = arr.myReduce((array, item) => array.push(item.id), [])

Array.prototype.myMap = function (callback){
  const result = []
  for(let i = 0; i < this.length; i ++){
    result.push(callback(this[i], i, this))
  }
  return result
}

Array.prototype.myFilter = function (callback){
  const result = []
  for(let i = 0; i < this.length; i ++){
    if (callback(this[i], i, this)){
      result.push(this[i])
    }
  }
  return result
}

Array.prototype.myReduce = function (callback, ...args){
  let start = 0, pre
  if (args.length){
    pre = args[0]
  } else {
    start = 1
    pre = this[0]
  }
  for (let i = 0; i < this.length; i++){
    pre = callback(pre, this[i], i, this)
  }
  return pre
}
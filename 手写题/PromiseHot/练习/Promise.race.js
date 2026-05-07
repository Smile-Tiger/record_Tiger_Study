// 完成对Promise.race的编写
Promise.myRace = function(arr){
  return new Promise((resolve, reject) => {
    for(let item of arr){
      Promise.resolve(item).then(res => {
        resolve(res) //便于Promise.race后，继续调用then链使用值
      }).catch(err => {
        reject(err)
      })
    }
  })
}
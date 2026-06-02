// 完成对Promise.race的编写
Promise.myRace = function(promises){
  return new Promise((resolve, reject) => {
    for(const item of promises){
      Promise.resolve(item).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    }
  })
}
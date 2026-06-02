Promise.myRace = function (arr) {
  return new Promise((resolve, reject) => {
    for (let item of arr) {
      // Promise的状态只改变一次，上面只new了一次Promise
      Promise.resolve(item).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    }
  })
}


let p1 = new Promise(resolve => {
  setTimeout(() => {
    resolve(1)
  }, 100)
})
let p2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    reject(2)
  })
})
let p3 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(3)
  })
})

Promise.myRace([p1, p2, p3]).then(res => {
  console.log(res);
}).catch(err => {
  console.log(err);
})

// 仅拿p1举例子，理解代数
// Promise.resolve(item).then(res => {
//   resolve(res)
// }).catch(err => {
//   reject(err)
// })
// p1 代入到resolve后，因为是Promise，所以直接返回，then的回调是异步，
// 等待resolve/reject执行结束传入值后才会执行
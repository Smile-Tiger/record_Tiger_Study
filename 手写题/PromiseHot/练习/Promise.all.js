Promise.all([
  Promise.reject(1), // 快速失败，直接返回失败结果，下面代码会执行then回调，但是结果忽略
  Promise.resolve(2),
  Promise.resolve(3),
  4,
]).then(
  (data) => {
    // data:[2, 3, 4]，将reject部分注释掉
    console.log("成功", data);
  },
  (reason) => {
    // reason:reason2
    console.log("失败", reason);
  }
)

function PromiseAll(iterable){
  if (typeof iterable[Symbol.iterator] !== 'function') {
    return Promise.reject(new TypeError('Promise.all requires an iterable'))
  }
  return new Promise((resolve, reject) => {
    const results = []
    let index = 0
    let remaining = 0
    try {
      for(let item of iterable){
        let currentIndex = index++
        remaining++
        Promise.resolve(item)
        .then(result => {
          results[currentIndex] = result
          if(--remaining === 0){
            resolve(results)
          }
        }).catch(reject)
      }
    } catch (e) {
      reject(e)
    }

    if (remaining === 0){
      resolve([])
    }
  })
}
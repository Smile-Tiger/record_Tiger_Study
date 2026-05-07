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
  if(typeof iterable[Symbol.iterator] !== 'function') {
    return Promise.reject(new TypeError('promise.all requires an iterable'))
  }
  return new Promise((resolve, reject) => {
    const results = []
    let remaining = 0
    let index = 0
    try {
      for(const item of iterable){
        const currentIndex = index++
        remaining++
        Promise.resolve(item)
          .then((value) => {
            results[currentIndex] = value
            if (--remaining === 0){
              resolve(results)
            }
          })
          .catch(reject)// ← 捕获失败，调用reject
        }
    } catch (error) {
      reject(error)
    }
    if (remaining === 0) {
      resolve([])
    }
  })
}
function PromiseAll(iterable) {
  // 1. 校验：判断传过来的值是否为可迭代对象，可迭代对象都有这个[Symbol.iterator]
  // typeof [][Symbol.iterator] 结果是function 
  if (typeof iterable[Symbol.iterator] !== 'function') {
    return Promise.reject(new TypeError('Promise.all requires an iterable'));
  }
  
  // new Promise的时候传executor函数会自动调用
  return new Promise((resolve, reject) => {
    const results = [];    // 存储每个 Promise 成功后的结果，按原数组顺序存放
    let remaining = 0;     // 记录还未完成的 Promise 数量（计数器）
    let index = 0;         // 当前处理的 Promise 在数组中的索引位置

    try {
      for (const item of iterable) {
        const currentIndex = index++; // 这里要注意，是先赋值后增加
        remaining++;
        Promise.resolve(item) // 这段代码的含义，无论传过来的是不是 Promise，都将其转换为 Promise进行处理
        // 假如item是Promise.resolve(2)，这里fufilled的一个结果，then回调形参传的就是2
        // Promise.resolve(Promise.resolve(2)) === Promise.resolve(2)，Promise内部对传入的参数做了特殊处理
          .then((value) => {
            results[currentIndex] = value;
            if (--remaining === 0) {
              resolve(results);
            }
          })
          .catch(reject);
      }
    } catch (e) {
      reject(e);
    }

    if (remaining === 0) {
      resolve([]);
    }
  });
}

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
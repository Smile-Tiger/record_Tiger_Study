// 与 Promise.all 不同， allSettled 等待所有 Promise 完成 （无论成功还是失败），然后返回每个 Promise 的结果状态。
Promise.myAllSettled = function (proms) {
  return new Promise((resolve, reject) => {
    let settledCount = 0; //状态已经确定的promise数
    let count = 0; //promise总数
    const result = [];
    for (const prom of proms) {
      let i = count; // i锁住了每一个结果的位置
      count++; 
      // Promise.resolve是将传过来的Prom转成Promise对象
      // resolve是执行函数
      Promise.resolve(prom).then(
        (data) => {
          settledCount++;
          result[i] = {
            status: "fullfilled",
            value: data,
          };
        },
        (reason) => {
          settledCount++;
          result[i] = {
            status: "rejected",
            reason,
          };
        }
      ).finally(() => {
        if(settledCount >= count){
          resolve(result)
        }
      });
    }
  });
};

const pro = new Promise((resolve, reject) => {
  setTimeout(() => {
    reject(3);
  }, 1000);
});

Promise.allSettled([pro, Promise.resolve(1), Promise.reject(2)]).then(
  (data) => {
    console.log(data);
  }
);

Promise.myAllSettled([pro, Promise.resolve(1), Promise.reject(2)]).then(
  (data) => {
    console.log(data);
  }
);
Promise.myAllSettled = function(promises){
  return new Promise((resolve, reject) => {
    let settledCount = 0
    let count = 0
    const result = []
    for(prom of promises){
      count++
      Promise.resolve(prom)
        .then(
          (data) => {
            settledCount++
            result[count] = {
              status: 'fullfilled',
              data
            }
          },
          (reason) => {
            settledCount++
            result[count] = {
              status: 'rejected',
              reason
            }
          }
        ).finally(() => {
          if(settledCount >= count){
            resolve(result)
          }
        })
    }
  })
}

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
Promise.myAllSettled = function (proms) {
  return new Promise((resolve, reject) => {
    let settledCount = 0
    let count = 0
    const result = []
    for (const prom of proms) {
      let i = count
      count++
      Promise.resolve(prom)
        .then(
          (data) => {
            settledCount++
            result[i] = {
              status: 'fullfilled',
              value: data
            }
          },
          (reason) => {
            settledCount++
            result[i] = {
              status: 'rejected',
              value: reason
            }
          }
        ).finally(() => {
          if (settledCount >= count) {
            resolve(result)
          }
        })
    }
  })
}
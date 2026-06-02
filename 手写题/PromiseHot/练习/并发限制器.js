async function concurrentControl(tasks, limit) {
  const results = new Array(tasks.length)
  let running = 0
  let currentIdx = 0
  let resolveAll, rejectAll
  const finalPromise = new Promise((resolve, reject) => {
    resolveAll = resolve
    rejectAll = reject
  })
  function run() {
    while (running < limit && currentIdx < tasks.length) {
      const idx = currentIdx++
      const task = tasks[idx]
      running++
      task()
        .then(result => {
          result[idx] = result
          running--
          if (running === 0 && currentIdx === tasks.length) {
            resolveAll(results)
          }
        })
        .catch(err => {
          rejectAll(err)
        })
    }
  }
  run()
  return finalPromise
}

const task1 = () => new Promise(resolve => setTimeout(() => resolve('A'), 1000));
const task2 = () => new Promise(resolve => setTimeout(() => resolve('B'), 500));
const task3 = () => new Promise(resolve => setTimeout(() => resolve('C'), 800));
const task4 = () => new Promise(resolve => setTimeout(() => resolve('D'), 200));
const task5 = () => new Promise(resolve => setTimeout(() => resolve('E'), 600));

concurrentControl([task1, task2, task3, task4, task5], 2).then(console.log);
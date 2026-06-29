// 串行
async function runSerial(tasks){
  const results = []
  for(task of tasks){
    const result = await task()
    results.push(result)
  }
  return results
}

// 并行
function runParallel(tasks){
  const promises = tasks.map(task => task())
  return Promise.all(promises)
}


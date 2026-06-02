/**
 * 串行执行任务数组（一个任务 执行完，再执行下一个，排队进行）
 * @param {Array<() => Promise<any>>} tasks 任务函数数组，每个函数返回 Promise
 * @returns {Promise<any[]>} 按顺序返回每个任务的结果
 */
async function runSerial(tasks) {
  const results = [];
  for (const task of tasks) {
    const result = await task(); // 等待当前任务完成
    results.push(result);
  }
  return results;
}

const task1 = () => new Promise(resolve => setTimeout(() => resolve(1), 1000));
const task2 = () => new Promise(resolve => setTimeout(() => resolve(2), 500));
const task3 = () => new Promise(resolve => setTimeout(() => resolve(3), 200));

runSerial([task1, task2, task3]).then(console.log);
// 大约 1.7 秒后输出 [1, 2, 3]（总耗时 = 1 + 0.5 + 0.2 = 1.7秒）

/**
 * 并行执行任务数组（多个任务 同时开始，不互相等待，齐头并进）
 * @param {Array<() => Promise<any>>} tasks 任务函数数组
 * @returns {Promise<any[]>} 结果数组
 */

function runParallel(tasks) {
  const promises = tasks.map(task => task()); // 立即启动所有任务
  return Promise.all(promises); // Promise.all 等待所有任务完成，返回结果数组，而且结果数组的顺序和传进去一样
}

const task4 = () => new Promise(resolve => setTimeout(() => resolve(1), 1000));
const task5 = () => new Promise(resolve => setTimeout(() => resolve(2), 500));
const task6 = () => new Promise(resolve => setTimeout(() => resolve(3), 200));

runParallel([task4, task5, task6]).then(results => console.log(results));
// 大约 1 秒后输出 [1, 2, 3]（总耗时 = 最慢的那个任务 1秒）
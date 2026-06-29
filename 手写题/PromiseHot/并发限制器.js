/**
 * 并发控制函数
 * @param {Array<() => Promise>} tasks 任务数组，每个任务是一个返回 Promise 的函数
 * @param {number} limit 最大并发数
 * @returns {Promise<any[]>} 按原顺序返回所有任务的结果
 */
async function concurrentControl(tasks, limit) {
  const results = new Array(tasks.length);   // 存放结果，保持顺序
  let running = 0;                           // 正在执行的任务数
  let currentIdx = 0;                       // 下一个要执行的任务索引（已分配任务数）
  let resolveAll, rejectAll;                // 用于控制最终的 Promise

  const finalPromise = new Promise((resolve, reject) => {
    resolveAll = resolve;
    rejectAll = reject;
  });

  // 尝试启动下一个任务（核心调度函数）
  function run() {
    // 当还有任务未执行，且并发数未满时，继续启动
    while (running < limit && currentIdx < tasks.length) {
      const idx = currentIdx++;
      const task = tasks[idx];
      running++;

      task()
        .then(result => {
          results[idx] = result;   // 保存结果，因为按照索引保存，所以顺序是固定的
          running--;               // 释放一个并发槽位(关键)
          run();                   // 尝试启动下一个
          // 如果所有任务都已执行完（包括队列中的和正在运行的）
          console.log(currentIdx)
          if (running === 0 && currentIdx === tasks.length) {
            resolveAll(results); // 返回的数组是按存入顺序返回
          }
        })
        .catch(err => {
          // 任何一个任务失败，整体失败（类似 Promise.all 行为）
          rejectAll(err);
        });
    }
  }

  run();
  return finalPromise;
}

// 模拟异步任务（不同耗时）
const task1 = () => new Promise(resolve => setTimeout(() => resolve('A'), 1000));
const task2 = () => new Promise(resolve => setTimeout(() => resolve('B'), 500));
const task3 = () => new Promise(resolve => setTimeout(() => resolve('C'), 800));
const task4 = () => new Promise(resolve => setTimeout(() => resolve('D'), 200));
const task5 = () => new Promise(resolve => setTimeout(() => resolve('E'), 600));

concurrentControl([task1, task2, task3, task4, task5], 2).then(console.log);
// 输出: ['A', 'B', 'C', 'D', 'E']   (顺序保持)
// 整个过程大约 1.8 秒（而不是串行的 3.1 秒）
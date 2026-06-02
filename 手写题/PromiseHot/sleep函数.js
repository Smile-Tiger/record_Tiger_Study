/**
 * 延迟指定毫秒数
 * @param {number} ms 延迟时间（毫秒）
 * @returns {Promise<void>} 返回一个 Promise，在延迟结束后 resolve
 */
function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), ms);
  });
}

// 可以在async函数中用
async function demo() {
  console.log('开始');
  await sleep(2000);          // 等待 2 秒
  console.log('2 秒后');
}
demo();

// 也可以在.then中使用
console.log('开始');
sleep(2000).then(() => {
  console.log('2 秒后');
});
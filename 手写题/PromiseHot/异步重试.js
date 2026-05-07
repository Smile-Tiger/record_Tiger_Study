/**
 * 异步重试函数
 * @param {Function} fn - 要执行的异步函数
 * @param {Object} options - 配置选项
 * @param {number} options.retries - 最大重试次数（默认3）
 * @param {number} options.delay - 重试间隔（默认1000ms）
 * @param {Function} options.onRetry - 每次重试的回调
 * @returns {Promise} - 返回执行结果
 */
function retry(fn, options = {}) {
  const { retries = 3, delay = 1000, onRetry } = options;
  
  // Promise里面存储的函数，在new的时候就立即调用了
  return new Promise((resolve, reject) => {
    let attemptCount = 0; //统计尝试次数
    
    const attempt = async () => {
      try {
        attemptCount++;
        const result = await fn();
        resolve(result);
      } catch (error) {
        // 判断是否还有重试次数
        if (attemptCount >= retries) {
          reject(new Error(`Failed after ${retries} attempts: ${error.message}`));
          return;
        }
        
        // 执行重试回调
        if (onRetry) {
          onRetry(attemptCount, error);
        }
        
        // 延迟后重试
        setTimeout(() => {
          attempt();
        }, delay);
      }
    };
    
    attempt();// 上面只是一个声明，真调用还得看这里
  });
}

// 模拟一个会失败的异步请求
let count = 0;
const fetchData = async () => {
  count++;
  console.log(`第${count}次尝试请求...`);
  
  // 前2次都失败，第3次成功
  if (count < 3) {
    throw new Error('网络超时');
  }
  
  return { data: '用户列表' };
};

// 使用重试函数
retry(fetchData, {
  retries: 5,      // 最多重试5次
  delay: 1000,     // 每次间隔1秒
  onRetry: (attempt, error) => {
    console.log(`第${attempt}次失败：${error.message}，1秒后重试...`);
  }
})
.then(result => {
  console.log('成功：', result);
})
.catch(error => {
  console.log('彻底失败：', error.message);
});

// 输出：
// 第1次尝试请求...
// 第1次失败：网络超时，1秒后重试...
// （等待1秒）
// 第2次尝试请求...
// 第2次失败：网络超时，1秒后重试...
// （等待1秒）
// 第3次尝试请求...
// 成功： { data: '用户列表' }
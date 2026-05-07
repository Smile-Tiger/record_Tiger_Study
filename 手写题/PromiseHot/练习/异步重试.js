function retry(fn, options = {}){
  const {retries = 3, delay = 1000, onRetry} = options
  
  return new Promise((resolve, reject) => {
    let attemptCount = 0
    const attempt = async () => {
      try{
        attemptCount++
        const result = await fn()
        resolve(result)
      } catch (error) {
        if (attemptCount >= retries) {
          reject(new Error(`Failed after ${retries} attempt: ${error.message}`))
          return
        }
        if(onRetry){
          onRetry(attemptCount, error)
        }
        setTimeout(() => {
          attempt()
        }, delay)
      }
    }
    attempt()
  })
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
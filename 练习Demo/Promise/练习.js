// 将手写题中的PromiseHot都要练熟


Promise.resolve() 
  .then(() => {
    console.log(1);
    throw new Error('error');
  })
  .catch(() => {
    console.log(2);
    throw new Error('again');
  })
  .then(() => {
    console.log(3);
  })
  .catch(() => console.log(4));
// 输出顺序：1,2,4
// 区分try catch和Promise的catch方法，try catch捕获异常后停止下面代码运行
// Promise的catch方法可以捕获同步异常和异步异常，但是只能捕获一次异常，能够接then方法

// 串行与并行
// 串行
async function test() {
  const a = await Promise.resolve(1);
  const b = await Promise.resolve(2);
  return a + b;
}
test().then(console.log);
// 尝试把代码改成并行Promise.all
async function test1(){
  const [a, b] = Promise.all([Promise.resolve(1), Promise.resolve(2)])
  return a + b
}

// 实现一个sleep函数
async function sleep(ms){
  await new Promise((resolve) => {
    setTimeout(() => resolve(), ms)
  })
  // 或者
  // return new Promise((resolve) => {
  //   setTimeout(() => resolve(), ms)
  // })
}
async function demo(){
  await sleep(1000)
}

// 大厂必做🌟
async function async1() {
  console.log('async1 start');
  await async2(); // async2函数调用是同步的，
  console.log('async1 end');
}
async function async2() {
  console.log('async2'); // 
}
console.log('script start');
setTimeout(() => console.log('setTimeout'), 0);
async1();
new Promise((resolve) => {
  console.log('promise1');
  resolve();
}).then(() => console.log('promise2'));
console.log('script end');
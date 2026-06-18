async function async1() {
  console.log('async1 start');
  await async2();
  // 特别注意
  //   async2 返回 undefined（包装成 Promise.resolve(undefined)）
  //   await 会让后面的代码 console.log('async1 end') 作为微任务排队
  console.log('async1 end');
}
async function async2() {
  console.log('async2');
}
console.log('script start');
setTimeout(() => console.log('setTimeout'), 0);
async1();
Promise.resolve().then(() => console.log('promise1'));
console.log('script end');
// script start -> async1 start -> async2 -> script end -> async1 end -> promise1 -> setTimeout


Promise.resolve().then(() => {
  console.log(0);
  return Promise.resolve(4); // 返回的Promise会等待两个任务周期之后才进入队列
}).then(res => console.log(res));

Promise.resolve().then(() => {
  console.log(1);
}).then(() => {
  console.log(2);
}).then(() => {
  console.log(3);
  // 第三个周期先执行then队列中的代码，再将延迟的Promise.resolve(4)加入队列
}).then(() => {
  console.log(5);
});


// 大厂真题🌟
async function foo() {
  console.log('foo start');
  await bar();
  console.log('foo end');
}
async function bar() {
  console.log('bar');
  return Promise.resolve('baz');
}
console.log('script start');
foo();
setTimeout(() => console.log('setTimeout'), 0);
Promise.resolve().then(() => console.log('promise1'));
console.log('script end');
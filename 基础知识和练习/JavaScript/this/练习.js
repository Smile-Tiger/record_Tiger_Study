// 第一题
const obj = {
  name: 'Inner',
  getName() {
    console.log(this.name);
  }
};
const fn = obj.getName;
fn();   // undefined

// 第二题❌
// 用 bind 实现一个 delayLog 函数，使得 delayLog({ name: 'Tom' }, 1000) 在 1 秒后打印 Tom。
function logName(){
  console.log(this.name)
}

function delayLog(obj, delay){
  const boundLog = logName.bind(obj)
  setTimeout(() => boundLog, delay)
}
delayLog({ name: 'Tom' }, 1000)

// 第三题❌
var length = 10;
function fn() {
  console.log(this.length);
}
const obj = {
  length: 5,
  method(fn) {
    fn(); // 10
    arguments[0](); 
    // arguments是当前方法接收的参数，arguments[0]就是fn，加个括号就表示了调用，
    // 这里就需要特别注意arguments[0]也就是fn，调用了自己本身，注意区别⚠️，arguments本身就有一个length属性，
    // 所以它的实际长度是
    // 2
  }
};
obj.method(fn, 1);
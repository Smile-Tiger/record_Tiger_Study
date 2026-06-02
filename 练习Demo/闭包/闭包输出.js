function test() {
  var arr = [];
  // 留意for循环的var定义i，共享同一个i，var的作用域是当前整个函数作用域
  for (var i = 0; i < 3; i++) {
    arr[i] = function() { console.log(i); };
  }
  return arr;
}
const fs = test();
fs[0](); fs[1](); fs[2](); // 输出3,3,3

// 解决：
// 使用let i = 0 或者是
// 立即执行函数
// (function(j){
//   arr[i] = function() {console.log(j)}
// })(i)
// 创建了一个新的函数作用域，参数 j 在这个作用域里是独立的一份拷贝。每次循环都会新建一个作用域，保存住当前的 i 值（赋值给 j）。


//  涉及作用域的知识
// 当一个函数内部定义了另一个函数，并且这个内部函数被返回或传递到外部使用时，它就形成了闭包，会"记住"外层作用域的变量。
function sum(a) {
  return function(b) {
    return function(c) {
      return a + b + c;
    };
  };
}
console.log(sum(1)(2)(3)); // 6
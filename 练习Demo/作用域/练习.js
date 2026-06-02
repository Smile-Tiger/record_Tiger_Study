// 1. 
var a = 1;
function foo() {
  console.log(a);
  var a = 2;
}
foo(); // 提升声明不提升赋值，先从当前作用域找，所以是1

// 2.
{
  function bar() { return 1; }
}
console.log(bar());  // 在非严格模式下输出 1,非严格模式下输出 undefined
// 历史遗留问题，非严格模式下块级作用域中的函数会挂载全局，变量是正常，

// 3.
function createCounters() {
  let arr = [];
  for (var i = 0; i < 3; i++) {
    arr.push(function() { console.log(i); });
  }
  return arr;
}
const counters = createCounters();
counters[0](); counters[1](); counters[2]();
// 3,3,3
// 因为调用数组里面的函数时，循环早已跑完，所以取的结果只会是3，只有循环数据现给现用的情况才是1,2,3

// 4.
var a = 10;
(function() {
  console.log(a);
  a = 20;
  console.log(window.a);
  var a = 30;
  console.log(a);
})();
console.log(a);
// undefined, 20, 30, 20 ❌
// 我的错误想法，以为a = 20没有声明所以是修改了全局，但其实不是，如果当前作用域有一个var，
// 当var变量提升，当前的a = 20会优先修改当前作用域的变量为主
// 正确答案是undefined, 10, 30, 10
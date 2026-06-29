// 1. 
var a = 1;
function foo() {
  console.log(a);
  var a = 2;
}
foo(); // 提升声明不提升赋值，先从当前作用域找，所以是undefined，聚焦函数里面的变量

// 2.
{
  function bar() { return 1; }
}
console.log(bar());  // 在非严格模式下输出 1,严格模式下输出 undefined
// 历史遗留问题，非严格模式下块级作用域中的函数会挂载全局，变量则正常，

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
// 共用同一个i，循环遍历存储函数体，由于闭包问题，会将函数内的i存储下来，所以访问的时候都是3

// 4. 留意没声明变量到底是修改哪里的数据
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
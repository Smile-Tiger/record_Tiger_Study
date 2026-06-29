// 第一题
var name = 'Global';
const obj = {
  name: 'Obj',
  say() {
    console.log(this.name);
  }
};
const fn = obj.say;
fn();   //  window / undefined / Global              
obj.say();  //  'Obj'

// 第二题
const obj1 = {
  name: 'Obj',
  say() {
    setTimeout(function() {
      console.log(this.name);
    }, 0);
  }
};
obj1.say();   // undefined / window / Global
// obj1确实是调用say方法，并且say的this是指向了obj1,但是定时器里的函数是直接调用的
// 理解
// function(callback, delay){
//  callback()
// }，这就是定时器内部调用方法的方式，此时this就指向了全局

// 第三题
function foo() {
  console.log(this.a);
}
const obj2 = { a: 1 };
const obj3 = { a: 2 };
const bound = foo.bind(obj2).bind(obj3);
bound();   // 1
//坑： bind只能绑定一次this

// 第四题
function Test(name) {
  this.name = name;
}
const obj4 = { name: 'Fixed' };
const BoundTest = Test.bind(obj4);
const instance = new BoundTest('Tom');// new的优先级比bind高，this的指向被新对象覆盖
console.log(instance.name);   // Tom
console.log(obj4.name);        // Fixed
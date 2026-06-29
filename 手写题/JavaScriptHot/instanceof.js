// 🌟基于原型链向上查找当前对象的原型链上是否存在某个构造函数的prototype对象
function myInstanceof(left, right) {
  let proto = Object.getPrototypeOf(left), // 获取对象的原型
      prototype = right.prototype; // 获取构造函数的 prototype 对象

  // 判断构造函数的 prototype 对象是否在对象的原型链上
  while (true) {
    if (!proto) return false;
    if (proto === prototype) return true;
    proto = Object.getPrototypeOf(proto); // 基于原型链查找
  }
}

function Person() { };
var p = new Person();
console.log(myInstanceof(p, Object));
// console.log(p instanceof Person);//true
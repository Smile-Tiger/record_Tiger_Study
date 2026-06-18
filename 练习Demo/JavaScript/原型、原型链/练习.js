function Foo() {}
Foo.prototype.name = 'Foo';
const f = new Foo();
console.log(f.name);                
console.log(f.hasOwnProperty('name')); 
f.name = 'Bar';
console.log(f.name);                
console.log(f.hasOwnProperty('name')); 
delete f.name;
console.log(f.name);                

// 原型链的终点是什么
// 原型链的终点是null，也就是Object.prototype.__proto__ === null


// 判断两个对象是否通过原型链关联（手写 instanceof）
// 基于原型链向上查找当前对象的原型链上是否存在某个构造函数的prototype对象，构造函数本身也是对象
function isInstanceOf(obj, Constructor) {
  let proto = Object.getPrototypeOf(obj);
  while (proto) {
    if (proto === Constructor.prototype) return true;
    proto = Object.getPrototypeOf(proto);
  }
  return false;
}


let a = { x: 1 };
let b = Object.create(a);
a.x = 2;
console.log(b.x);   
b.x = 3;
console.log(a.x);   
delete b.x;
console.log(b.x);


console.log(Function instanceof Object);   
console.log(Object instanceof Function);
// 例当前Object对象原型链上是否有Function的prototype（翻译过来是这样）   


// 🌟大厂真题 注意手画一下原型链出来
function F() {}
Object.prototype.a = function() { console.log('a'); };
Function.prototype.b = function() { console.log('b'); };
const f = new F(); 
f.a();   // a
f.b();   // 报错 
F.a();   // a
F.b();   // b
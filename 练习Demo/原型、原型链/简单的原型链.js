// 手写new操作
function myNew(Constructor, ...args) {
  // 1. 创建一个空对象，它的原型指向 Constructor.prototype
  const obj = Object.create(Constructor.prototype);
  // 2. 执行构造函数，把 this 绑定到新对象上
  const result = Constructor.apply(obj, args);
  // 这两步代码是执行了一次new操作，先将新对象的原型指向构造函数的原型，
  // 以便能够通过原型链访问到构造函数的属性和方法，再将构造函数的this指向新对象，执行构造函数的代码
  // 3. 如果构造函数返回了对象，则返回那个对象；否则返回新对象
  return (typeof result === 'object' && result !== null) ? result : obj;
}
// 测试
function Person(name) { this.name = name; }
const p = myNew(Person, 'Tom');
console.log(p.name);       // 'Tom'       
console.log(p instanceof Person);  // true


// 组合继承
function Parent(name) {
  this.name = name;
  this.colors = ['red', 'blue'];
}
Parent.prototype.sayName = function() { console.log(this.name); };

function Child(name, age) {
  Parent.call(this, name);   // 继承实例属性
  this.age = age;
}
// 设置原型链继承
Child.prototype = Object.create(Parent.prototype);
Child.prototype.constructor = Child;  // 修复构造函数指向
Child.prototype.sayAge = function() { console.log(this.age); };

const c = new Child('Alice', 10);
c.sayName();  // 'Alice'
c.sayAge();   // 10
console.log(c.colors); // ['red', 'blue']


// 查找自身属性
function getProperty(obj, prop) {
  while (obj !== null){
    if(obj.hasOwnProperty(prop)){
      return obj[prop]
    }
    obj = Object.getPrototypeOf(obj) // 沿着原型链向上获取原型
  }
  return undefined
}
const parent = { a: 1 };
const child = Object.create(parent);
child.b = 2;
console.log(getProperty(child, 'a')); // 1
console.log(getProperty(child, 'c')); // undefined
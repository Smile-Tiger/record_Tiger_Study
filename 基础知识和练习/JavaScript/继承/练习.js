// 你能手写组合继承吗？
function Parent(name) {
  this.name = name
  this.colors = ['red', 'green', 'blue']
}

function Child(name, age){
  Parent.call(this, name)
  this.age = age
}

Child.prototype = Object.create(Parent.prototype)
// 用Object.create是寄生组合，用new Parent是组合继承
Child.prototype.constructor = Child

// 输出题
function A() {}
A.prototype = { x: 1 };
const a = new A();
console.log(a.x);  // 1
A.prototype = { x: 2 };
console.log(a.x);  // 1
// 注意：实例的 __proto__ 指向旧原型，而不是新原型，所以实例的属性是旧原型的属性
// 实例的原型在new时就已经确定了，后续修改原型不会影响实例的属性
const b = new A();
console.log(b.x);  // 2

// 手撕extends函数
function _extends(child, parent) {
  child.prototype = Object.create(parent.prototype)
  child.prototype.constructor = child
  // 让子类构造函数能够调用父类构造函数的静态属性和方法，
  // 将子类的__proto__指向父类构造函数
  Object.setPrototypeOf(child, parent)
}

// 输出题
function Parent() { this.name = 'parent'; }
Parent.prototype.getName = function() { return this.name; };
function Child() { this.name = 'child'; }
Child.prototype = new Parent();
const c = new Child();
console.log(c.getName());
// this绑定给了当前对象c，所以通过Child实例化的时候有个name是child
// 调用getName拿到的名字也是child

// 用class重写
function Animal(type) { this.type = type; }
Animal.prototype.speak = function() { console.log(this.type + ' speaks'); };
function Dog(type, name) { Animal.call(this, type); this.name = name; }
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;
Dog.prototype.bark = function() { console.log(this.name + ' barks'); };

// 写出你的重写
class Animal{
  constructor(type){
    this.type = type
  }
  // static speak(){ 实例方法写到原型，直接往构造函数加才是静态方法
  speak(){
    console.log(this.type + ' speaks')
  }
}
class Dog extends Animal{
  constructor(name, type){
    super(type)
    this.name = name
  }
  // static bark(){
  bark(){
    console.log(this.name + ' barks')
  }
}

// 大厂真题（美团）🌟
function A() {}
A.prototype.a = 1;
function B() {}
B.prototype = Object.create(A.prototype);
B.prototype.b = 2;
function C() {}
C.prototype = Object.create(B.prototype);
C.prototype.c = 3;
const c = new C();
console.log(c.a, c.b, c.c);
// 输出？
// 1,2,3
// 然后执行：C.prototype = {}; c.a 还能访问吗？
// 可以，因为已经new的对象已经记住它当前的原型链，再去修改不影响它原先的原型链
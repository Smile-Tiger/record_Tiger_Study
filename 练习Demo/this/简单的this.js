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
// 聚焦有console.log的方法，这个方法没有调用者obj1调用say，但是定时器里面的那个方法没有被调用，所以指向全局

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
const instance = new BoundTest('Tom');
console.log(instance.name);   // Tom
console.log(obj4.name);        // Fixed
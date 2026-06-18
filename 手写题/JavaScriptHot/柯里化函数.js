function myCurrying(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    } else {
      return function (...args2) {
        // 通过apply改变this指向，为了避免在复用函数时报this为undefined/null
        return curried.apply(this, args.concat(args2));
      };
    }
  }
}

// 柯里化（Currying）是把 一个多参数函数
//  转换成 一系列单参数函数 的技术。
// 普通函数
// add(1, 2, 3)  // 一次传入所有参数
// 柯里化后
// add(1)(2)(3)  // 分次传入参数
// 或
// add(1, 2)(3)

// this的指向是为了确保如果调用柯里化的是对象的话，可能造成数据丢失
// function greet(greeting, name) {
//   return `${greeting}, ${name}！我是${this.role}`;
// }

// const obj = {
//   role: '管理员',
//   sayHello: myCurrying(greet)
// };

// // 链式调用
// obj.sayHello('你好')('豆包');
// 可能这个this.role会丢失成为undefined
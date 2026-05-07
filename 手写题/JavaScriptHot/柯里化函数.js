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

// // 1. myCurrying 函数 - 接收1个参数（要柯里化的函数）
// function myCurrying(fn) {    // ← myCurrying.length = 1
//   // ...
// }
// // 2. 你传入的 fn - 可以有任意个参数
// function sum(a, b, c) {      // ← sum.length = 3
//   return a + b + c;
// }
// // 使用
// const curriedSum = myCurrying(sum);  // 把 sum 传给 myCurrying
// //                   ↑ fn = sum
// //                   ↑ fn.length = 3（不是1！）
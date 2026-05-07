/**
   * 无论成功还是失败都会执行回调
   * @param {Function} onSettled
   */
 Promise.prototype.finally = function (onSettled) {
    return this.then(
      (data) => {
        onSettled(); // 调用没有传参
        return data;
      },
      (reason) => {
        onSettled();
        throw reason;
      }
    );
    // finally函数 返回结果应该是无效的
  }
  
/******test finally*******/
// 无论什么结果，都会运行
const pro = new Promise((resolve, reject) => {
  resolve(1);
});
const pro2 = pro.finally(
  (d) => {
    console.log("finally", d);
    return 123;
  } // 这部分是onSettled函数，没有传参所以d是undefined，且onSettled没有参数接收，return的123没有用；
  // resolve的1传到了data上，所以pro2是1
);
setTimeout(() => {
  console.log(pro2);
});

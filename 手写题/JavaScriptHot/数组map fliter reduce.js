Array.prototype.map = function (callback) {
  const res = [];
  for (let i = 0; i < this.length; i++) {
    res.push(callback(this[i], i, this))
  }
  return res;
}

Array.prototype.myFilter = function (callback) {
  const res = [];
  for (let i = 0; i < this.length; i++) {
    callback(this[i], i, this) && res.push(this[i]); // 这里可以写成if / else
  }
  return res;
};

Array.prototype.myReduce = function (callback, ...args) {
  let start = 0, // 数组起始索引
    pre;  // 累加器
  if (args.length) {
    //有参数的话pre等于参数第0项
    pre = args[0];
  } else {
    //没参数的话，默认从数组0项开始
    pre = this[0];
    start = 1;
  }
  for (let i = start; i < this.length; i++) {
    pre = callback(pre, this[i], i, this);
  }
  return pre;
};
Object.myCreate = function (proto) {
  if (typeof proto !== 'object' && typeof proto !== 'function') {
    throw new TypeError("proto必须为对象或者函数");
  } else if (proto === null) {
    throw new Error("在浏览器中暂不支持传递null");
  }
  function F() { }
  F.prototype = proto
  return new F()
}

const parent = { name: "豆包" };
const child = Object.myCreate(parent);
console.log(child.name); // 豆包
console.log(child.__proto__ === parent); // true
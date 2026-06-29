Object.create = function (proto) {
    if (typeof proto !== 'object' && typeof proto !== 'function') {
        throw new TypeError('proto必须是对象或者函数')
    }
    function F() { }
    F.prototype = proto
    return new F()
}

const parent = { name: "豆包" };
const child = Object.myCreate(parent);
console.log(child.name); // 豆包
console.log(child.__proto__ === parent); // true
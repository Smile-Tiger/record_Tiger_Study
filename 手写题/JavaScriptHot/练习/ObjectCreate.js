Object.myCreate = function (proto) {
    if (typeof proto !== "object" && typeof proto !== "function") {
        // 类型校验
        throw new TypeError("proto必须为对象或者函数");
    } else if (proto === null) {
        // null 特殊处理
        throw new Error("在浏览器中暂不支持传递null");
    }

    // 创建一个构造函数
    function F() {}
    // 更改其 prototype
    F.prototype = proto;

    // 返回构造的实例， 这个时候返回的实例和传入的 proto中间多了一层 F
    return new F();
};

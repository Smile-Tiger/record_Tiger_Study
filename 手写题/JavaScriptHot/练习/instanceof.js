// 看着例子完成instance的书写
function Person() { };
var p = new Person();
console.log(myInstanceof(p, Object));

function myInstanceof(left, right){
  let proto = Object.getPrototypeOf(left)
  let prototype = right.prototype

  while(true){
    if(!proto) return false
    if(proto === prototype) return true
    proto = Object.getPrototypeOf(proto)
  }
}
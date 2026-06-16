var a = 1;
function foo(a) {
  console.log(a);
  var a = 2;
  console.log(a);
}
foo(3);
console.log(a);
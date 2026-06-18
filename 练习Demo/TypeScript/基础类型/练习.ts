// 为以下变量添加正确的类型注解（或利用推断）
// 1. 用户名（字符串）
const userName = "Alice"; // 需要加类型吗？不需要，有数据有的是可以自动推断
// 2. 年龄（数字）
let age : number; // 声明时未赋值，请给它手动加上类型注解，使其只能存数字 

// 定义一个元组（Tuple），表示一个坐标点，第一个值是 x（数字），第二个值是 y（数字），
// 第三个值是 label（字符串，可选）。并写出一个变量赋值给它。
let tuple: [number, number, string] = [1, 2, 'haha']

// 定义一个函数 formatInput，它接收一个参数 input，
// 这个 input 可能是 string 或 number 或 null。如果是 string 或 number，返回 "Valid: " + input；如果是 null，
// 返回 "Empty"。请用联合类型 + 类型收缩实现，并给函数添加正确的返回值类型。
function formatInput(input: string | number | null): string {
  if (typeof input === 'string' || typeof input === 'number'){
    return "Valid:" + input
  } else {
    return "Empty"
  }
}

// 下面这段 TS 代码会报错吗？如果会，请问如何修改才能让它不报错，并且仍然保持类型安全？
let value: unknown = "Hello World";
let length: number = value.length;
console.log(length);
// 答：这段TS代码会报错，因为unknown类型需要进行收缩类型后才能够使用
// let length: number = typeof value === "string" ? value.length : 0
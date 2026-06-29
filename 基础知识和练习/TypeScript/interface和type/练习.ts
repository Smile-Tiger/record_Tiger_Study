// 以下代码有报错吗？为什么？
interface Config {
  url: string;
}
interface Config {
  timeout: number;
}
const c: Config = { url: 'api', timeout: 1000 };
// 没有报错，两个相同的接口定义不同的属性或方法时，会自动拼接

// 将下面的 type 改写为等价的 interface 写法
type FnType = (x: number) => string;
// 修改
interface FnType{
  (x: number): string
}

//业务场景：组件 Props 必须包含 name（string），也可能包含 age（number）或 salary（number），
// 但 age 和 salary 不能同时存在（二选一）。请问：用 interface 该如何实现？用 type 又该如何实现？谁更适合？
type Props = {name: string, age: number, salary?: never} |
{name: string, age?: never, salary: number}
// 这里的?:是表示 ，可以不填，但填了的话是赋值为never，会报错，如果不加冒号，就是必须要填这个never类型，始终就报错了

// 请问 result 的类型是什么？它会报错吗？为什么？
type A = { x: number; y: number };
type B = { y: string; z: number };
type C = A & B;
const result: C = { x: 1, y: 2, z: 3 };
// result 的类型是{x: number, y: never, z: number}，会报错的，如果两个类型不一样然后去交叉时，会变成never类型
// 实现一个函数 getProperty，安全地获取对象中的某个属性值。
// k extends keyof T表示K必须是T这个类型所有属性名中的某一个
// 比如T extends K，泛型中的extends不是表示继承，而是表示T中至少包含K中的所有属性
function getProperty<T, K extends keyof T> (obj: T, key: K): T[K]{
  return obj[key]
}


// 将下面的 any 函数改写成泛型函数，让它既能传入数组，又能保留类型。
function getFirst<T>(arr: T[]): T {
  return arr[0];
}

// 定义一个泛型接口 Result<T>，包含 isSuccess: boolean 和 value: T。
interface Result<T>{
  isSuccess: boolean
  value: T
}

// 实现一个函数 getProperty（上面讲过），但需要确保对象的属性存在，否则 TS 报错。
function getProperty2<T , K extends keyof T>(obj: T, key: K): T[K]{
  return obj[key]
}
// 答：如果extends keyof已经确保了K是T中属性的某一个，那我觉得不需要再确保对象属性存在了，因为已经确保属性存在了

// 阅读以下代码，请问 test 函数的返回值类型是什么？为什么？
// 这里的extends表示T必须是string或者是number中的某一个
function test<T extends string | number>(arg: T): T {
  return arg;
}
const testResult = test('hello');
// 答：返回值的类型是string，因为形参传入字符串的时候，TS会自动检测并将泛型替换为传入参数的类型

// ⚠️：返回值类型是 'hello'（即字符串字面量类型 "hello"），而不是宽泛的 string。

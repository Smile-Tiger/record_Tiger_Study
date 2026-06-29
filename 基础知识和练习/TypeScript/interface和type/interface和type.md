# interface和type

## 定义

1. **本质**：`interface` 侧重于“结构契约”，`type` 侧重于“类型别名”。
2. **合并**：`interface` 支持声明合并（同名自动合并），`type` 不支持（重复定义报错）。
3. **范围**：`type` 能表示联合、元组、映射类型等；`interface` 主要用于对象/函数/类。
4. **冲突**：interface `extends` 冲突会直接报错（如两个interface有相同属性，但是类型不同）；type`&`（交叉）冲突会变成 `never`，隐含风险。（两个不同类型交叉）
5. **建议（升华）**：官方推荐能用 `interface` 就用 `interface`，需要用到联合或映射类型时再用 `type`。

# 区别

#### **区别 1：声明合并（Declaration Merging）**

- `interface`：支持 **声明合并**。如果定义两次同名的 `interface`，TS 会自动把它们**合并**成一个。
- `type`：不支持。同名 `type` 会报错（重复标识符）。

```JSX
// ✅ Interface：自动合并
interface User {
  name: string;
}
interface User {
  age: number;
}
// 最终 User 相当于 { name: string; age: number; }
const u: User = { name: 'Tom', age: 18 };

// ❌ Type：报错
type Animal = { name: string };
type Animal = { age: number }; // 错误：标识符“Animal”重复
```

#### **区别 2：扩展方式（继承 vs 交叉）**

- `interface`：使用 `extends` 关键字继承另一个接口，语义清晰，适合 OOP（面向对象）。
- `type`：使用 `&`**（交叉类型）** 组合多个类型。

```JavaScript
// Interface extends
interface Person { name: string; }
interface Employee extends Person { job: string; }

// Type 交叉（&）
type Person = { name: string; };
type Employee = Person & { job: string; };
```

#### **区别 3：能定义的类型范围（最核心的区别！）**

- `interface`：**只能**描述对象、函数、类、数组等“对象类型”。（\*注意：在 TS 4.2+ 后，interface 也能描述一些简单的联合类型，但极其受限且不推荐\*）。
- `type`：**可以描述任何类型**。

```JavaScript
// 1. 基本类型别名
type UserID = string | number;

// 2. 联合类型（最常用）
type Status = "pending" | "success" | "error";

// 3. 元组
type Point = [number, number];

// 4. 工具类型（映射类型）
type Readonly<T> = { readonly [P in keyof T]: T[P] };
```

#### **区别 4：处理冲突的方式（软 vs 硬）**

- `extends`**（Interface）**：如果两个接口继承时出现同名但类型不同的属性，TS 会**直接报错**，让你立即修复。
- `&`**（Type 交叉）**：如果两个类型交叉时出现同名属性冲突，TS **不会报错**，而是会将该属性变成 `never`（不可能的类型），这可能导致你后续使用时莫名其妙出错。

```JavaScript
interface A { x: string; }
interface B { x: number; }
interface C extends A, B {} // ❌ 直接报错：类型不一致

type D = A & B; // ✅ 不会报错，但 D 的 x 类型是 never（既不是 string 也不是 number）
```


# 概念总结

## UI=f（state）

- 观察以下代码：`state`（状态）变了 → React 重新执行 `App()` 这个函数 → 拿到新的 `count` 值 → 刷新界面（Diff 算法算出只有数字变了，只更新那一个地方）
- 假如你在组件顶层写了一个普通的 `const a = 1;`，每次函数重新执行时，都会被**重新定义**一次。只有 `useState` 里的值，React 会帮你“记住”它，不会因为重新执行而丢失。

```JavaScript
function App() {
  // 2. 声明状态：count 是数字，setCount 是更新函数
  // TS 自动推断 count 为 number 类型（因为初始值是 0）
  const [count, setCount] = useState(0)

  console.log('组件函数执行了', count)
  return (
    <div>
      <h1>Hello World</h1>
      <p>当前计数： {count}</p>
      <button onClick={() => setCount(count + 1)}>
        点击增加
      </button>
    </div>
  )
}

```

## UseEffect

**`useEffect`** 用于处理副作用（数据请求、DOM 操作、订阅等），在 render **之后**执行。比如：

- 请求后端数据（`fetch('/api/user')`）
- 设置定时器（`setInterval`）
- 手动修改浏览器标题（`document.title = 'xxx'`）
- 操作 DOM（但不是 React 的方式）

**这些事不能在渲染过程中做**，否则会干扰 React 的正常工作。

| 写法                                          | 执行时机                         | 形象比喻               |
| ------------------------------------------- | ---------------------------- | ------------------ |
| `useEffect(() => {...})`（**没有**第二个参数）       | **每次**组件渲染（函数重新执行）后都执行       | 每次吃完饭都洗一次碗（不管干不干净） |
| `useEffect(() => {...}, [])`（**空数组**）       | **只执行一次**，在组件第一次出现在页面上时（挂载后） | 只在搬新家那天搞一次大扫除      |
| `useEffect(() => {...}, [count])`（**有依赖项**） | 第一次执行，且当 `count` 变化时重新执行     | `count` 变一次，你就检查一次 |

<br />

`useEffect` 里的箭头函数，**可以返回一个新的函数**。这个返回的函数叫“清除函数”，在组件**被销毁时**或**下次执行前**被调用。

```JavaScript
//1. 
useEffect(() => {
  console.log(count); 
}, []);// count首次取值后，当count更新时，useEffect里的值不变，拿的初始值，形成闭包。最好将所用到的变量写在依赖数组中。

//2. 
useEffect(() => {
  setCount(count + 1); 
}, [count]);// 首次就执行，执行后state变化，重新调用App函数，useEffect检测到变化，又+1，形成死循环
//解决
useEffect(() => {
  setCount(prev => prev + 1);
}, []);// 函数式更新，将原有的count替换成一个规则，而不是一个值，当
```

<br />

```JavaScript
//1. 
useEffect(() => {
  console.log(count); 
}, []);// count首次取值后，当count更新时，useEffect里的值不变，拿的初始值，形成闭包。最好将所用到的变量写在依赖数组中。

//2. 
useEffect(() => {
  setCount(count + 1); 
}, [count]);// 首次就执行，执行后state变化，重新调用App函数，useEffect检测到变化，又+1，形成死循环
//解决
useEffect(() => {
  setCount(prev => prev + 1);
}, []);// 函数式更新，将原有的count替换成一个规则，而不是一个值

```

<br />

函数式更新和普通更新的区别，函数式更新是永远获取最新值来进行更新，但是普通更新的话，只是聚焦本次渲染进行更新，拿的是旧值，例子如下

```JavaScript
setCount(prev => prev + 1);
setCount(prev => prev + 1);

setCount(prev + 1)
setCount(prev + 1)
// 普通更新：setCount(count + 1)，它会基于当前渲染闭包中的状态值来计算，在同一个事件中连续调用多次，每次用的都是同一个旧值，所以只会生效一次。
// 函数式更新：setCount(prev => prev + 1)，React 会把当前最新的状态值作为参数传给这个函数，因此连续调用时，第二次会基于第一次的结果继续累加。
```

## 父子通信

1. **父传子**：用 `属性名={变量}` 传，用 `function Child({属性名}: Props)` 接。
2. **子传父**：父组件把“修改函数”传给子组件，子组件调用它。
3. **状态提升**：如果多个组件要用同一个状态，把这个状态放到它们**最近的共同父组件**里管理

```JavaScript
import { useState } from 'react';

// --- 子组件 1：只负责显示（只读 Props） ---
interface DisplayProps {
  count: number;
}
function Display({ count }: DisplayProps) {
  return (
    <div>
      <p>当前数字：{count}</p>
    </div>
  );
}

// --- 子组件 2：只负责修改（通过回调修改父组件） ---
interface ControlProps {
  onIncrement: () => void; // 这是一个没有参数、没有返回值的函数类型
}
function Control({ onIncrement }: ControlProps) {
  return (
    <div>
      <button onClick={onIncrement}>数字 + 1</button>
    </div>
  );
}

// --- 父组件（App）：掌管唯一的真相来源（state） ---
function App() {
  // 数据被“提升”到这里统一管理
  const [count, setCount] = useState(0);

  // 修改数据的函数（传给子组件）
  const handleIncrement = () => {
    setCount(prev => prev + 1);
  };

  return (
    <div>
      {/* 传递数据给子组件（父传子） */}
      <Display count={count} />
      {/* 传递修改函数给子组件（子传父的桥梁） */}
      <Control onIncrement={handleIncrement} />
    </div>
  );
}

export default App;
```

## React的性能优化

问题：**父组件（App）的 `count`** 变了，App 函数重新执行，里面的所有子组件（哪怕是只负责显示、没有任何变化的子组件）也会跟着重新执行，这种“无意义”的重新渲染就会浪费性能

`React.memo` 是 React 自带的高阶函数。作用就是：**“检查一下传给组件的 Props 有没有变化，如果没变，就直接用上次的结果，不再重新执行这个组件函数。”**

```JavaScript
import React, { useState } from "react";

// 这是一个“纯展示”子组件，它只接收一个字符串并显示
const Child = React.memo({ text }: { text: string }) {
  console.log("🔥 子组件重新渲染了！"); // 这是我们的“监视器”
  return <div>子组件收到：{text}</div>;
}

function App() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState("Hello");

  return (
    <div>
      <h1>父组件 Count: {count}</h1>
      <button onClick={() => setCount(count + 1)}>点我改 Count（无关子组件）</button>
      <hr />
      <Child text={text} />
    </div>
  );
}

export default App; 
```

`React.memo` 只能防住“值没变”的情况，但防不住“引用变了”的函数。因为它们是内存中两个不同地址的方法，所以此时要使用useCallback防止这种情况

## useCallback

```JavaScript
import React, { useState } from "react";

// 子组件：接收 text 和一个 函数
const Child = React.memo(({ text, onClick }: { text: string; onClick: () => void }) => {
  ...
});

function App() {
  ...

  // 使用 useCallback 包裹函数
  // 空依赖数组 [] 意味着：这个函数只在组件第一次加载时创建一次，之后永远不变
  const handleChildClick = useCallback(() => {
    console.log("子组件的按钮被点击了！");
  }, []);
  // 如果依赖数组有state，只有在函数内所使用的state发生变化时，才会重新创建函数让函数内拿到新值

  ...
}
```

`useCallback` 就是干这个的：“只要依赖项没变，我就永远返回同一个函数引用。”如果你用了 `React.memo`，并且子组件里传了函数，那么函数必须用 `useCallback` 包起来，否则 `React.memo` 就白写了。

- `useCallback` 用来**缓存函数引用**，避免父组件每次渲染都创建新函数，从而防止子组件因为接收到“假的新函数”而被迫重渲染。
- `React.memo` 用来**缓存子组件本身**，当子组件的 `props` 没变时，直接跳过子组件的重新渲染。

## 关于自定义Hook

**假设你在两个不同的页面（组件）里，都需要监听窗口的宽度。难道你要把那一堆 `useState`** + **`useEffect`** + **`window.addEventListener`** 的代码，原封不动地复制粘贴两次吗？

**自定义 Hook就是 React**把组件里重复的**状态逻辑**抽出来，封装成一个函数，让多个组件共用。

### 必须遵守的规则

1. **命名必须用 `use`** 开头（比如 `useWindowSize`）。\
   React 靠这个前缀来检查你是否违反了 Hook 的规则（比如在循环里调用）。
2. **只能在函数组件或其他自定义 Hook 的顶层调用**（不能放在 `if` 或 `for` 里面）。
3. **它是一个函数，可以返回值**（可以是数据，也可以是操作函数）。

```JavaScript
// 定义hook
import { useState, useCallback } from 'react';

function useToggle(initialValue: boolean = false) {
  const [value, setValue] = useState(initialValue);

  // 用 useCallback 保证 toggle 函数的引用不变
  const toggle = useCallback(() => {
    setValue(prev => !prev);
  }, []);

  return [value, toggle] as const; // as const 让 TS 推断为元组类型
}

export default useToggle;


// 组件的使用
import useToggle from './hooks/useToggle';

function App() {
  const [isVisible, toggleVisible] = useToggle(false); // 初始为 false

  return (
    <div>
      <button onClick={toggleVisible}>
        {isVisible ? '隐藏' : '显示'} 文字
      </button>
      {isVisible && <p>✨ 这段文字出现了！</p>}
    </div>
  );
}
```

## useContext

一个数据从子组件传到祖父组件，中间的父组件**根本不关心这个数据，只是为了传下去而被迫接收**（这种情况叫**Props Drilling**）。`useContext` 就是为了解决这个“隔代传参”的痛点而生的。

所以一般隔绝层数多或者是整个应用都需要这个数据，就可以用useContext来完成了

```JavaScript
// src/context/UserContext.tsx
import { createContext, useContext, ReactNode } from 'react';

interface User {
  name: string;
  age: number;
}

const UserContext = createContext<User | null>(null);

// 3. 创建一个“供给者”组件（Provider），专门用来包裹上层组件
export function UserProvider({ children }: { children: ReactNode }) {
  const user: User = {
    name: '小明',
    age: 18,
  };

  return (
    <UserContext.Provider value={user}>
      {children} 
    </UserContext.Provider>
  );
}

// 4. 创建一个“自定义 Hook”，方便子孙组件直接拿来用
export function useUser() {
  const context = useContext(UserContext);
  if (context === null) {
    throw new Error('useUser 必须在 UserProvider 内部使用');
  }
  return context;
}

// 在main.tsx包裹起来
<UserProvider>
    <App />
</UserProvider>

//顺便理解一下
<UserContext.Provider value={user}>
      {children} 
</UserContext.Provider>
// 里面children其实就是<UserProvider>包裹的标签，通过绑定value往包裹的标签传递数据

// 在孙组件中就可以通过hook拿到祖父组件传来的数据了
const user = useUser()
```

## useReducer

```JavaScript
// 1. 引入 useReducer
import { useReducer } from 'react';

// 2. 定义状态的结构（TS 习惯）
interface CounterState {
  count: number;
}

// 3. 定义指令（Action）的类型（TS 习惯，推荐用联合类型限制死能发的指令）
type CounterAction = 
  | { type: 'increment' }
  | { type: 'decrement' }
  | { type: 'reset' }
  | { type: 'add'; payload: number }; // payload 是额外携带的数据（比如加5）

// 4. 核心：reducer 管理员（根据指令修改状态）
function counterReducer(state: CounterState, action: CounterAction): CounterState {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    case 'reset':
      return { count: 0 };
    case 'add':
      return { count: state.count + action.payload };
    default:
      // 不认识这个指令就报错（这是标准写法）
      throw new Error('未知的操作类型: ' + (action as any).type);
  }
}

// 5. 在组件里使用
function App() {
  // 参数1：reducer 函数；参数2：状态初始状态
  const [state, dispatch] = useReducer(counterReducer, { count: 0 });
  const { count } = state; // 解构出来方便使用

  return (
    <div style={{ padding: 20 }}>
      <h1>🔢 useReducer 计数器</h1>
      <p>当前数字：{count}</p>
      
      {/* 发指令：dispatch({ type: '指令名' })，传的对象往action传 */}
      <button onClick={() => dispatch({ type: 'increment' })}>➕ 加1</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>➖ 减1</button>
      <button onClick={() => dispatch({ type: 'reset' })}>🔄 重置</button>
      <button onClick={() => dispatch({ type: 'add', payload: 5 })}>➕ 加5</button>
    </div>
  );
}

export default App;
```

`dispatch` 的执行是**同步**的。一旦调用 `dispatch`，React 会立即执行 `reducer` 计算新状态，并同步刷新页面。

## useMemo

`useMemo`** 是用来“缓存计算结果”的，和 **`useCallback`** 是“缓存函数”的，它们俩是同一种优化思想的不同表现形式。把计算结果缓存起来，依赖没变就不重新算。**

```JavaScript
function ProductList({ products, filterText }) {
  // ❌ 每次渲染都重新过滤，如果 products 很大就很慢
  const filtered = products.filter(p => p.name.includes(filterText));

  // ✅ 只有 products 或 filterText 变化时才重新过滤
  const filtered = useMemo(() => {
    return products.filter(p => p.name.includes(filterText));
  }, [products, filterText]);

  return <div>{filtered.map(...)}</div>;
}
```


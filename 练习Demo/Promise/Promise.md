# Promise 

## 定义

- **Promise 是一个对象，代表一个异步操作的最终完成（或失败）及其结果值。**

## 特点

- 状态一旦改变（从 pending 变为 fulfilled 或 rejected），就**不可逆**，且之后再次调用 `.then()` 会立即拿到结果。
- 支持链式调用，避免回调地狱。
- 所有异步操作可以统一用 Promise 管理。
- **Promise 本身不能被取消**

```JavaScript
const p = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('成功啦');
  }, 1000);
});
p.then(res => console.log(res));

我从头到尾解释一下这段代码：首先执行器函数同步立即执行（传给new Promise的函数），由于事件循环，定时器任务存入宏任务队列，p对象创建好后在then中写入回调函数（将回调函数存入了回调列表），这一步也是同步任务，同步任务执行完毕，定时器任务出宏任务队列并执行，并且执行resolve，此时Promise的状态发生改变（pending -》 resolve），将回调存入微任务队列，定时器执行结束后（第一次事件循环只有宏任务，没有微任务），第二次事件循环没有宏任务，只有微任务，此时微任务执行。
```

## 关于Promise需要手撕的方法看手写体的PromiseHOT

- `Promise.resolve(value)`：返回一个 resolved 的 Promise。
- `Promise.reject(reason)`：返回一个 rejected 的 Promise。
- `Promise.all(iterable)`：所有成功才成功，一个失败就失败（失败为第一个失败原因）。
- `Promise.race(iterable)`：第一个 settled 的结果（无论成功/失败）。
- `Promise.allSettled(iterable)`：等待所有结束，返回每个的状态和结果。
- `Promise.any(iterable)`：一个成功就成功，全部失败才失败（ES2021）。

## 问题延伸

#### **Q1：Promise 是同步还是异步？**

- 执行器函数（`executor`）是**同步执行**的。
- `.then()`/`.catch()` 的回调是**异步**（微任务）。

#### **Q2：`.then()` 的参数如果不是函数，会发生什么？**

会进行**值穿透**，例如 `Promise.resolve(1).then(2).then(console.log)` 输出 `1`。\
因为非函数参数会被忽略，值继续向后传递。

#### **Q3：Promise 和 async/await 的关系？**

`async` 函数返回一个 Promise，`await` 用于等待一个 Promise 完成。它们是 Promise 的语法糖，让异步代码更像同步。

```JavaScript
async function foo() {
  return 123;
}
const result = foo();
console.log(result); // Promise {<fulfilled>: 123}，不是 123
// 无论你在 async 函数里 return 什么，外面拿到的都是一个 Promise。如果你要用这个值，得 .then 或者 await
```

# async / await

## 定义

`async/await`**让 Promise 的链式调用可以像同步代码一样书写。**

- `async` 关键字标记一个函数，使它总是返回一个 Promise。
- `await` 关键字用于等待一个 Promise 完成（resolve/reject），并返回 resolved 的值；如果 reject，则抛出异常（可以被 `try/catch` 捕获）。

## 原理

### async / await本质特点

- `async` 函数**总是返回一个 Promise**。如果函数体返回一个非 Promise 值，它会被自动包装成 `Promise.resolve(value)`

* `await` 后面可以接任何值（Promise 或非 Promise）。如果接非 Promise，它会隐式包装成 `Promise.resolve(value)`。

- `await` 会暂停当前 `async` 函数的执行，让出线程，等待右侧的 Promise 状态变更。

```JavaScript
// 你写的 async/await
async function example() {
  const a = await foo();
  const b = await bar(a);
  return b;
}
// 引擎大致转换成类似：
function example() {
  return foo()
    .then(a => bar(a))
    .then(b => b);
}
```

### 与事件循环的关系

- `await` 后面的代码会被包装成微任务，在微任务队列清空后执行。

### 错误处理机制

- `await` 如果等待的 Promise 变为 `rejected`，会**抛出异常**，可以用 `try/catch` 捕获。
- 如果不捕获，异常会冒泡，让整个 `async` 函数返回一个 rejected Promise。

## 延伸问题

#### **async/await 的底层转换**

问：`await` 后面的代码是怎么执行的？\
答：`await` 会将后续代码包装成 `.then()` 回调，放入微任务队列，等到 Promise settled 执行。其实await包装的代码可能会更快，但是它是严格排到所有微任务的队尾

#### **`async/await` 比 Promise 慢吗？**

- 有微小的性能损耗（因为生成器/状态机转换），但通常可以忽略。
- 如果追求极高性能（如超大规模循环），可以用原生 Promise，但大多数场景不需要在意。

#### **`forEach` 中能不能用 `await`？**

```JavaScript
async function test(list) {
  list.forEach(async (item) => {
    await process(item);   // 问题：不会等待，forEach 立即返回
  });
  console.log('done');     // 先于 process 完成输出
}
```

也就是说：`forEach`** 不会等待 **`await`** 完成，它会一次性把所有的迭代都启动，然后立即退出。**

**解决方案**：用 `for...of` 或 `Promise.all(list.map(process))`。

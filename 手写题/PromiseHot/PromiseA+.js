const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

// 该函数是根据不同环境下执行回调
function runMicroTask(callback) {
  // 1. globalThis是一个关键字，指代全局对象，浏览器环境为window，node环境为global
  //    是 ES2020 引入的标准内置对象，用于 统一访问不同环境下的全局对象
  // 2. process 是 Node.js 的 全局内置对象，process.nextTick是node环境中最快的微任务回调方式，相当于Promise.then
  if (globalThis.process && globalThis.process.nextTick) {
    process.nextTick(callback);
  } else if (globalThis.MutationObserver) {
    // 判断浏览器是否支持 MutationObserver，MutationObserver也是微任务，比setTimeout快
    const p = document.createElement("p");
    const observer = new MutationObserver(callback);
    observer.observe(p, {
      childList: true, // 监听p元素子元素的变化
    });
    p.innerHTML = "1";// 更改元素是为了触发监听器
  } else {
    setTimeout(callback, 0);
  }
}

// 只要对象有then方法，都归为Promise对象
function isPromise(obj) {
  return !!(obj && typeof obj === "object" && typeof obj.then === "function");
}

class MyPromise {
  // executor 是用户传入的函数 (resolve, reject) => {...}
  constructor(executor) {
    this._state = PENDING; // 初始化状态
    this._value = undefined; // 初始数据
    this._handlers = []; // 存储 .then() 注册的回调队列
    try {
      // 用户的函数可以接收一个，也可以两个方法一同接收
      // 执行用户函数，绑定 this，将this永远绑定给new出来的对象
      executor(this._resolve.bind(this), this._reject.bind(this));
    } catch (error) {
      this._reject(error);
      console.error(error);
    }
  }

  // 这段代码是将 .then() 注册的回调信息存入队列，等待 Promise 状态确定后执行
  _pushHandler(executor, state, resolve, reject) {
    this._handlers.push({
      executor,
      state,
      resolve,
      reject,
    });
  }

  /**
   * 根据实际情况，执行队列
   */
  _runHandlers() {
    if (this._state === PENDING) {
      // 状态还是PENDING时，不执行then回调
      return;
    }
    while (this._handlers[0]) {
      const handler = this._handlers[0];
      this._runOneHandler(handler);
      this._handlers.shift();
    }
  }

  /**
   * 处理一个handler
   * @param {Object} handler
   */
  _runOneHandler({ executor, state, resolve, reject }) {
    runMicroTask(() => {
      if (this._state !== state) {
        // 状态不一致，不处理
        return;
      }

      if (typeof executor !== "function") {
        // 传递后续处理并非一个函数
        this._state === FULFILLED ? resolve(this._value) : reject(this._value);
        return;
      }
      try {
        const result = executor(this._value);
        if (isPromise(result)) {
          result.then(resolve, reject); // 如果是Promise，把Promise跑一遍得到结果，可能里面有resolve进行传递
        } else {
          resolve(result);
        }
      } catch (error) {
        reject(error);
        console.error(error);
      }
    });
  }

  /**
   * Promise A+规范的then
   * @param {Function} onFulfilled
   * @param {Function} onRejected
   */
  then(onFulfilled, onRejected) {
    return new MyPromise((resolve, reject) => {
      this._pushHandler(onFulfilled, FULFILLED, resolve, reject);
      this._pushHandler(onRejected, REJECTED, resolve, reject);
      this._runHandlers(); // 这里并非无用，思考当resolve为同步的时候，改变了数值，但是如果这里没有这个的时候，永远都不会执行
    });
  }

  /**
   * 仅处理失败的场景
   * @param {Function} onRejected
   */
  catch(onRejected) {
    return this.then(null, onRejected);
  }

  /**
   * 无论成功还是失败都会执行回调
   * @param {Function} onSettled
   */
  finally(onSettled) {
    return this.then(
      (data) => {
        onSettled();
        return data;
      },
      (reason) => {
        onSettled();
        throw reason;
      }
    );
  }

  /**
   * 更改任务状态
   * @param {String} newState 新状态
   * @param {any} value 相关数据
   */
  _changeState(newState, value) {
    if (this._state !== PENDING) {
      // 目前状态已经更改
      return;
    }
    this._state = newState;
    this._value = value;
    this._runHandlers(); // 状态变化，执行队列
  }

  /**
   * 标记当前任务完成
   * @param {any} data 任务完成的相关数据
   */
  _resolve(data) {
    this._changeState(FULFILLED, data);
  }

  /**
   * 标记当前任务失败
   * @param {any} reason 任务失败的相关数据
   */
  _reject(reason) {
    this._changeState(REJECTED, reason);
  }

}

const p = new MyPromise((resolve) => {
  console.log('1. 执行器同步执行');
  setTimeout(() => {
    console.log('2. 异步完成，调用 resolve');
    resolve('成功数据');
  }, 100);
});

p.then((data) => {
  console.log('3. then 回调:', data);
  // 这里默认返回的undefined,会在_runHandlers取handlers[0]时终止
});
console.log('4. 同步代码结束');

// const p = new MyPromise(...);

// 关于为什么要改变this指向
// // 情况 1：直接调用 ✅
// p._resolve('数据');  // this 指向 p，正常！

// // 情况 2：传给回调后调用 ❌
// const fn = p._resolve;
// setTimeout(() => {
//   fn('数据');  // 普通函数调用，this 变成 undefined！
// }, 100);
// 这里是简单的把方法赋值给了fn然后调用是window.fn如果严格模式的话是undefined是这个意思不，this值指向了undefined，所以要绑定this，
// 绑定了this每逢再次调用方法的话都是指代调用p的_resolve方法



// 一、链式调用例子
// new MyPromise((resolve) => {
//   resolve(10);
// })
//   .then((data) => {
//     console.log('第1个:', data);  // 10
//     return data * 2;
//   })
//   .then((data) => {
//     console.log('第2个:', data);  // 20
//     return data * 2;
//   })
//   .then((data) => {
//     console.log('第3个:', data);  // 40
//   });
// 输出: 第1个: 10 → 第2个: 20 → 第3个: 40


// 二、then返回Promise
// new MyPromise((resolve) => {
//   resolve('开始');
// })
//   .then((data) => {
//     console.log('第1个:', data);
//     return new MyPromise((resolve) => {
//       setTimeout(() => resolve('嵌套Promise'), 50);
//     });
//   })
//   .then((data) => {
//     console.log('第2个:', data);  // 嵌套Promise
//   });

// 输出: 第1个: 开始 → (50ms后) → 第2个: 嵌套Promise


// 三、then复用结果
// const p = new MyPromise((resolve) => {
//   setTimeout(() => resolve('共享数据'), 100);
// });

// this._value没变所以复用了结果

// p.then((d) => console.log('A:', d));
// p.then((d) => console.log('B:', d));
// p.then((d) => console.log('C:', d));

// // 100ms后同时输出:
// // A: 共享数据
// // B: 共享数据
// // C: 共享数据

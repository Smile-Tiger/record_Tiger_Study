const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

function runMicroTask(callback) {
  if (globalThis.process && globalThis.process.nextTick) {
    globalThis.process.nextTick(callback)
  } else if (globalThis.MutationObserver) {
    const p = document.createElement('p')
    const observer = new MutationObserver(callback)
    observer.observe(p, {
      childList: true
    })
    p.innerHTML = '1'
  } else {
    setTimeout(callback, 0)
  }
}

function isPromise(obj) {
  return !!(obj && typeof obj === 'function' && typeof obj.then === 'function')
}

class MyPromise {
  constructor(executor) {
    this.state = PENDING,
      this.value = undefined
    this.handlers = []
    try {
      executor(this._resolve.bind(this), this._reject.bind(this))
    } catch (error) {
      this._reject(error)
      console.error(error)
    }
  }

  then(onFulfilled, onRejected) {
    return new MyPromise((resolve, reject) => {
      this.handlers.push(onFulfilled, FULFILLED, resolve, reject)
      this.handlers.push(onRejected, REJECTED, resolve, reject)
      this._runHandlers()
    })
  }

  _runOneHandler({ executor, state, resolve, reject }) {
    runMicroTask(() => {
      if (this.state !== state) return
      if (typeof executor !== 'function') {
        this.state === FULFILLED ? resolve(this.value) : reject(this.value)
        return
      }
      try {
        const result = executor(this.value)
        if(isPromise(result)){
          result.then(resolve, reject)
        } else {
          resolve(result)
        }
      } catch (error) {
        reject(error)
        console.error(error)
      }
    })
  }

  catch(onRejected) {
    return this.then(null, onRejected)
  }

  finally(onSettled) {
    return this.then(
      (data) => {
        onSettled()
        return data
      },
      (reason) => {
        onSettled
        return reason
      }
    )
  }

  _runHandlers() {
    if (this.state === PENDING) {
      return
    }
    while (this.handlers[0]) {
      const handler = this.handlers[0]
      _runOneHandler(handler)
      shift(this.handlers[0])
    }
  }

  _changeState(state, value) {
    if (this.state !== PENDING) return
    this.state = state
    this.value = value
    this._runHandlers()
  }

  _resolve(data) {
    this._changeState(FULFILLED, data)
  }

  _reject(reason) {
    this._changeState(REJECTED, reason)
  }
}
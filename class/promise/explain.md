# PromiseA+规范

## 术语

1. promise 是一个有then方法的对象或者函数，行为遵循 promiseA+规范
2. thenable 是一个有then方法的对象或者函数
3. value 是 promise 状态成功时的值，也就是 resolve 的参数，包括各种数据类型， undefined number boolean promise
4. reason 是 promise 状态失败时的值，也就是reject的参数，表示拒绝的原因
5. exception throw 抛出去的异常

## 规范

### Promise States
promise 应该有三种状态，要注意他们之间的流转关系

resolve reject 是动作
fulfilled  rejected 是状态，是动作的结果


1. pending

    1.1 初始的状态，可以改变
    1.2 一个promise在被resolve或者reject之前，都处于这个状态
    1.3 通过 resolve => fulfilled
    1.4 通过 reject => rejected

2. fulfilled

    2.1 最终态，不可以改变
    2.2 一个promise经过resolve后变成这个状态
    2.3 必须拥有一个value值 // 不传value就会返回undefined

3. rejected

    3.1 最终态，不可以改变
    3.2 一个promise经过reject后变成这个状态
    3.3 必须拥有一个reason值 // 不传reason就会返回undefined

pending => resolve(value) => fulfilled  最终态
pending => reject(value) => rejected  最终态

### then

promise 规范规定应该提供一个then方法，用来访问最终的结果，无论value还是reason

```js
promise.then(onFulfilled, onRejected);
```

1. 参数要求

    1.1 onFulfilled 必须是函数类型，如果不是函数，应该被忽略
    1.2 onRejected 必须是函数类型，如果不是函数，应该被忽略

2. onFulfilled 特性

    2.1 在pormise变成 fulfilled 时，应该调用 onFulfilled， 参数是 value
    2.2 在promise变成 fulfilled 之前，不应该被配用
    2.3 只能被调用一次（需要用变量限制执行次数）

3. onRejected 特性

    3.1 在pormise变成 rejected 时，应该调用 onRejected 参数是 reason
    3.2 在promise变成 rejected 之前，不应该被配用
    3.3 只能被调用一次（需要用变量限制执行次数）

4. onFulfilled 和 onRejected 应该是微任务

    setTimeout 是宏仁务，不应该用来调用
    queneMicrotask 实现微任务的调用

5. then方法可以被调用多次（需要两个数组来存储）

    promise.then(callback1).then(callback2).then(callback3)...

    const promise = new Promise();
    promise.then(callback1)
    promise.then(callback2)
    ...

    5.1 promise 变成 fulfilled 后，所有 onFulfilled 的回调都应该按照then的顺序执行
        在实现promise的时候，需要一个数组来存储 onFulfilled 的 callback

    5.1 promise 变成 rejected 后，所有 onRejected 的回调都应该按照then的顺序执行
        在实现promise的时候，需要一个数组来存储 onRejected 的 callback

6. 返回值

    then的返回值是一个新的promise

    ```js
    promise2 = promise1.then(onFulfilled, onRejected);
    ```

    6.1 onFulfilled 或者 onRejected 执行的结果为x，调用 resolvePromise
    6.2 onFulfilled 或者 onRejected 执行时抛出异常，promise2 需要被 reject
    6.3 如果 onFulfilled 不是一个函数时，promise2 以 promise1 的 value 触发 fulfilled
    6.4 如果 onRejected 不是一个函数， promise2 以 promise1 的 reason 触发 rejected

7. resolvePromise（真正的promise的返回方法，核心）

    ```js
    resolvePromise(promise2, x, resolve, reject)
    ```

    7.1 如果 promise2 和 x 相等，那么 reject TypeError.
    7.2 如果 x 是一个promise
        如果 x 是pending，promise的状态必须也是pending，直到x变成了 fulfilled/rejected
        如果 x 是fulfilled，直接抛出 fulfill 的值 
        如果 x 是rejected，直接抛出 reject 的值 

    7.3 如果 x 是一个Object 或者是一个 Function

        let then = x.then;
        如果 x.then这一步出错了， try catch(e) reject(e); (比如修改了promise的属性)
        如果 then 是一个函数， then.call(x, resolvePromiseFn, rejectPromiseFn)

        resolvePromiseFn 的入参是y，执行resolvePromise(promise2, y, resolve, reject)
        如果调用then的时候抛出了异常error，直接reject reason
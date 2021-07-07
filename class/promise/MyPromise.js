const PENNDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

class MyPromise {
    

    /**
     * @param {Function} fn (resolve, reject) =>
    */
    constructor(fn) {
        this.FULFILLED_CALLBACK_LIST = [];
        this.REJECTED_CALLBACK_LIST = [];
        this._status = PENNDING;
        // 初始状态为pending
        this.status = PENNDING;
        this.value = null;
        this.reason = null;

        try {
            // 传入this是为了指向当前上下文
            fn(this.resolve.bind(this), this.reject.bind(this));
        } catch(e) {
            this.reject(e);
        }
    }

    get status() {
        return this._status
    }

    set status(newStatus) {
        this._status = newStatus;
        switch(newStatus) {
            case FULFILLED: {
                this.FULFILLED_CALLBACK_LIST.forEach( callback => {
                    callback(this.value);
                })
                break;
            }
            case REJECTED: {
                this.REJECTED_CALLBACK_LIST.forEach( callback => {
                    callback(this.reason);
                })
                break;
            }
        }
    }

    resolve(value) {
        // 只有pending状态才可以变成resolve
        if(this.status === PENNDING) {
            this.value = value;
            this.status = FULFILLED;
        }
    }

    reject(reason) {
        // 只有pending状态才可以变成reject
        if(this.status === PENNDING) {
            this.reason = reason;
            this.status = REJECTED;
        }
    }

    then(onFulfilled, onRejected) {
        const realOnFulfilled = this.isFunction(onFulfilled) ? onFulfilled : (value) => {
            return value;
        }
        const realOnRejected = this.isFunction(onRejected) ? onRejected : (reason) => {
            return reason;
        }
        // .then 的返回值是一个promise
        const promise2 = new MyPromise((resolve, reject) => {
            const fulfilledMicrotask = () => {
                queueMicrotask(() => {
                    try {
                        const x = realOnFulfilled(this.value);
                        this.resolvePromise(promise2, x, resolve, reject);
                    } catch (error) {
                        reject(error);
                    }
                })
            }
            const rejectedMicrotask = () => {
                queueMicrotask(() => {
                    try {
                        const x = realOnRejected(this.reason);
                        this.resolvePromise(promise2, x, resolve, reject);
                    } catch (error) {
                        reject(error);
                    }
                })
            };
            // 当调用.then的时候，不同的状态，要调用不同的回调
            switch(this.status) {
                case FULFILLED: {
                    fulfilledMicrotask();
                    break;
                }
                case REJECTED: {
                    rejectedMicrotask();
                    break;
                }
                case PENNDING: {
                    this.FULFILLED_CALLBACK_LIST.push(realOnFulfilled);
                    this.REJECTED_CALLBACK_LIST.push(realOnRejected);
                    break;
                }
            }
        });
        return promise2
    }

    catch(onRejected) {
        return this.then(null, onRejected);
    }

    resolvePromise(promise2, x, resolve, reject) {
        if(promise2 === x) {
            return reject(new TypeError('promise2 === x'));
        }

        if(x instanceof MyPromise) {
            // 如果x是promise，那么让新的promise接收x的状态
            // 就是继续执行x，如果执行的时候又拿到了一个y，那么继续解析y
            queueMicrotask(()=>{
                x.then(y => {
                    this.resolvePromise(promise2, y, resolve, reject);
                }, reject)
            })
        } else if (typeof x === 'object' || this.isFunction(x)) {
            if(x === null) {
                return resolve(x);
            }
            let then = null;
            try {
                then = x.then;
            } catch (error) {
                reject(error);
            }

            // 如果获取到的then是一个函数
            if(this.isFunction(then)) {
                let called = false;
                try {
                    then.call(x, (y) => {
                            if(called) {
                                return
                            }
                            called = true;
                            this.resolvePromise(promise2, y, resolve, reject);
                        },(r) => {
                            if(called) {
                                return
                            }
                            called = true;
                            reject(r);
                        }
                    )
                } catch (error) {
                    if(called) {
                        return
                    }
                    reject(error)
                }
            } else {
                resolve(x);
            }
        } else {
            resolve(x);
        }
    }

    isFunction(value) {
        return typeof value === 'function'
    }

    static resolve(value) {
        if(value instanceof MyPromise) {
            return value 
        }

        return new MyPromise(resolve => {
            resolve(value)
        })
    }

    static reject(reason) {
        return new MyPromise((resolve, reject)=> {
            reject(reason)
        })
    }


    static race(promiseList) {
        return new MyPromise((resolve, reject) => {
            const length = promiseList.length;

            if(length === 0) {
                return resolve();
            } else {
                for (let index = 0; index < length; index++) {
                    MyPromise.resolve(promiseList[index].then(
                        (value) => {
                            return resolve(value);
                        },
                        (reason) => {
                            return reject(reason);
                        }
                    ))
                }
            }
        })
    }
}

 

// const test = new MyPromise((resolve, reject) => {
//     setTimeout(() => {
//         resolve('resolve111');
//     }, 1000);
// }).then(value => {
//     console.log('value', value);
// });

const test1 = new MyPromise((resolve, reject) => {
    setTimeout(() => {
        resolve('race111');
    }, 1000);
});

const test2 = new MyPromise((resolve, reject) => {
    setTimeout(() => {
        resolve('race222');
    }, 2000);
});

const test3 = new MyPromise((resolve, reject) => {
    setTimeout(() => {
        resolve('race333');
    }, 3000);
});

MyPromise.race([test1, test2, test3]).then(value => console.log(value));
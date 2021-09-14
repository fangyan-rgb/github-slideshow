### 事件循环
    Node.js 是单进程单线程应用程序，但是因为 V8 引擎提供的异步执行回调接口，通过这些接口可以处理大量的并发，所以性能非常高。
    Node.js 几乎每一个 API 都是支持回调函数的。
    Node.js 基本上所有的事件机制都是用设计模式中观察者模式实现。
    Node.js 单线程类似进入一个 While(true) 的事件循环，知道没有时间观察者退出，每个异步事件都生成一个事件观察者，如果有事件发生就调用该回调函数。

### 事件驱动程序
    Node.js 使用事件驱动模型，当 web server 接收到请求，就把它关闭然后进行处理，然后去服务下一个 web 请求。
    当这个请求完成，它被放回处理队列，当到达队列开头，这个结果被返回给用户。
    这个模型非常高效可扩展性非常强，因为 web server 一直接受请求而不等待任何读写操作。这也称之为非阻塞 IO 或者事件驱动 IO
    在事件驱动模型中，会生成一个主循环来监听事件，当检测到事件时触发回调函数


Node.js 有多个内置的事件，我们可以通过引入 events 模块，并通过实例化 EventEmitter 类来绑定和监听事件，如下：
```js
var events = require('events');
var eventEmitter = new events.EventEmitter();
```
通过以下程序绑定事件处理程序：
```js
eventEmitter.on('eventName', eventHandler());
```
然后通过程序触发事件：
```js
eventEmitter.emit('eventName');
```
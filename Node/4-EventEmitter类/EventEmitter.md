### Node.js EventEmitter

1. Node.js 所有的异步 I/O 操作在完成时都会发送一个事件到事件队列。
2. Node.js 里面的许多对象都会分发事件：一个 net Server 对象会在每次有新连接时触发一个事件，一个 fs.readStream 对象会在文件被打开的时候触发一个事件。所有这些产生事件的对象都是 events.EventEmitter 的实例。


### EventEmitter 类

events 模块只提供了一个对象： events EventEmitter。EventEmitter 的核心就是事件触发与事件监听器功能的封装。可以直接通过 require('events') 来访问该模块：
```js
// 引入 events 模块
var events = require('events');
// 创建 eventEmitter 对象
var eventEmitter = new events.EventEmitter();
```


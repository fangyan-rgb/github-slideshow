### Stream（流）
Stream 是一个抽象接口，Node 中有很多对象实现了这个接口。例如，对 http 服务器发起请求的 request 对象就是一个 Stream，还有 stdout （标准输出）。
它有四种类型：
- Readable 可读操作
- Writable 可写操作
- Duplex 可读可写操作
- Transform 操作被写入数据，然后读出结果
所有的 Stream 对象都是 EventEmitter 的实例。常用的事件有：
- data 当有数据可读时触发
- end 没有更多的数据可读时触发
- error 在接收和写入过程中发生错误时触发
- finish 所有数据已被写入到底层系统时触发

## 从流中读取数据（createReadStream.js）
通过 fs 模块的 createReadStream 方法获取到文件的文本，继续将获取到的文本流通过 setEncoding 方法转为 UTF8，随后通过 on 方法对流进行拼接或输出
 
## 写入流（createWriteStream.js）
通过 fs 模块的 createWriteStream 方法获取到(没有获取到就创建)要写入流的文件，直接通过 write 方法对文件写入 UTF8 编码的流数据

读取和写入现在学会了是不是有个大胆的想法。
别急，还有更简单的

## 管道流（pipe.js）
顾名思义，就是从一个文件到另一个文件。
首先，还是通过 fs 模块，分别用 createReadStream 和 createWriteStream 方法分别获取读取流和写入流的文件，随后通过管道 pipe 直接导向写入文件

## 链式流
链式是通过连接输出流到另一个流并创建多个流操作链的机制。链式流一般用于管道操作。
结合管道和链式来压缩和解压文件。

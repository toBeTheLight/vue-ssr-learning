基于《深入浅出 nodeJS》，可能与现在 node 实现有所不同，粗读。

# 第一章 简介

## Node的特点

* 异步 I/O + 回调
* 单线程
  * 问题：
    * 无法利用多核
    * 错误引起整个程序退出
    * 大量计算占用 CPU 无法继续调用异步 I/O
  * 解决：
    * 创建新的线程
    * 浏览器端 web worker 解决
    * node 端 child_process 解决

# 第二章 模块机制

## CommonJS 规范

`module.exports / exports`，`require`

## Node 模块实现

* 优先从换从加载，缓存的是编译和执行之后的对象
* 路径分析和文件定位
  * 模块标识符分析
    * 核心模块
    * 路径
    * 非路径文件模块（node_modules查找等）
  * 文件定位
    * 文件名分析，如后缀补全
    * 目录分析和包，
  * 模块编译
    * 类型
      * .js 文件：通过 fs 模块同步读取并编译执行
      * .node 文件：C/C++ 编写
      * .json 文件：fs 读取，JSON.parse()
      * .其他扩展名文件：当做 .js 文件
    * 具体过程
      * .js 文件：读取后对文件进行头尾包装，封装进函数，此时会提供 exports、require 等模块化语法的声明（实现）
      * .c/c++ 模块：通过 libuv 兼容层做不同平台的兼容
      * .json 文件：fs 读取，JSON.parse()

## 核心模块

* JavaScript 核心模块编译：
  * 将内置 JavaScript 代码转换成 C++ 内数组，生成 node_natives.h 头文件，这个过程中 JavaScript 代码以字符串形式存储在 node 命名空间。
  * 在 node 启动时，JavaScript 代码直接存储在内存中。
  * 引入过程同样经历包装。
  * 编译成功的模块缓存到 NativeModule._cache，文件模块缓存到 Module._cache。
* C/C++ 核心模块编译：
  * 纯 C/C++ 编写的部分称为内建模块。
  * 内建模块定义后，通过 NODE_Module 宏定义到 node 命名空间，node_extensions.h 头文件将散列内建模块统一放入 node_module_list 的数组中。
  * Node 使用 get_builtin_module() 方法取出。
  * 文件模块可能依赖核心模块，核心模块可能依赖内建模块。
* 核心模块引入：经历 C/C++ 层面的内建模块定义，核心模块定义以及文件模块层面引入。

## 编写核心模块

略

## C/C++ 扩展模块

略

## 模块调用栈

* C/C++ 内建模块：提供 API 给 JavaScript 核心模块和第三方 JavaScript 文件模块调用。
* JavaScript 核心模块：作为 C/C++ 内建模块的封装层和桥接层或纯功能模块。

## 包与 NPM

前略

* 问题：
  * 具备良好的测试。
  * 具备良好的文档。
  * 具备良好的测试覆盖率。
  * 具备良好的编码规范。
  * 更多条件。

## 前后端公用模块

UMD

# 第三章 异步 I/O

* 异步可消除 UI 阻塞。
* 前端体验取决于后端款速响应资源。

## 资源分配

* 多线程：
  * 缺点：创建线程和执行期线程上下文切换开销较大。复杂业务面临锁、状态同步等问题。
  * 优势：多核 CPU 上能够有效提高利用率。
* 单线程：
  * 缺点：串行执行，通常 I/O 进行会让后续任务等待。
* Node：将大规模异步 I/O 应用在应用层。

## 异步 I/O 实现现状

[同步非阻塞、异步阻塞](https://www.zhihu.com/question/39565359/answer/81999324)

* 阻塞：不向下执行。
* 异步：不直接返回结果（可能有未处理完的结果）。

现存轮询技术：
  * read：遍历查询重复检查 I/O 状态。
  * select：遍历查询通过对文件描述符的事件状态，1024 长度的数组来存储状态。
  * poll：改用链表。
  * epoll：事件通知、执行回调。非遍历查询。

非阻塞I/O
  * 理想：无须通过遍历或者事件唤醒等方式轮询，直接处理下一个任务，I/O 完成后通过信号或回调将数据传递给应用程序。
  * 现实：依靠线程池实现。

## Node 的异步 I/O

[执行过程](https://tobethelight.github.io/2018/03/11/%E6%B5%8F%E8%A7%88%E5%99%A8%E5%92%8Cnode%E4%B8%8D%E5%90%8C%E7%9A%84%E4%BA%8B%E4%BB%B6%E6%89%A7%E8%A1%8C%E5%92%8C%E5%BE%AA%E7%8E%AF%E6%9C%BA%E5%88%B6/)

## 事件驱动与高性能服务器

* 同步式
* 每进程/每请求
* 每线程/每请求
* 事件驱动

# 第四章 异步编程

## 函数式编程

* 高阶函数：将函数作为参数，或将函数作为返回值的函数。
* 偏函数用法：创造一个调用另外一个部分（参数或变量已经预置的函数）的函数的用法。

## 异步编程的优势和难点

* 优势：
  * 资源更好的利用
  * 并行 -> 分布式和云
* 难点：
  * 异常处理：不能直接在同步部分捕捉异步 callback 中的错误。
  * 回调地狱：现在可以使用 promise 或 async 等解决。
  * 阻塞代码：如其他语言中的 sleep（不是死循环）。
  * 多线程编程：Node 端使用 child_process 和 cluster。
  * 异步转同步：可以使用 async。

## 异步编程解决方案

* 事件发布/订阅模式：
  * 事件超过 10 个侦听器，会警告。
  * 完整监听和捕捉 error。
  * 善用 once 绑定侦听解决雪崩问题。
* Promise/Deferred 模式：三种 Promise/Deferred 模型，Promises/A、Promises/B、Promises/D。
  * Promises/A：
    * 三种状态：未完成态、完成态、失败态。
    * 只能从未完成态向其他态转化。
    * 状态一旦转化将不能被更改。
    * 操作完成或出现错误时，将会调用对应方法。
    * then() 方法继续返回 Promise 对象。
    * Deferred 主要用于内部，维护异步模型的状态。Promise 用于外部，通过 then() 方法暴露给外部添加自定义逻辑。
    * 低级接口可以构成更多更复杂的场景，高级接口对于解决典型为题非常有效但是不如低级灵活。
  * Promise 中的多异步协作：
    * promise.all([p1, p2]).then([r1, r2, r3])
  * Promise 的进阶知识（一种实现）：
    * 队列中存储所有的回调。
    * Promise 完成时，逐个执行，当返回了新的 Promise 对象时，将当前 Deferred 对象的 promise 引用改变为新的 promise 对象（即实现 then 的链式调用）。
* 流程库控制：
  * 尾触发与 Next：同样使用队列存储中间件，使用 next 完成递归调用。
  * 其他库：现在可以使用 promise / async / await 等解决。

## 异步并发控制

* 使用队列长度完成并发控制。

# 第五章 内存控制

## V8 的垃圾回收机制与内存控制

* 内存限制：
  * Node 是基于 chrome 的 JavaScript 引擎 V8的。
  * V8 不同于其他的后端开发语言的运行环境，在内存使用上是有限制的（64 位约 1.4 GB，32 位约 0.7 GB）。无法操作大内存，如大文件一次读入内存。
* 对象分配：
  * V8 中，所有的 JavaScript 对象都是通过堆进行分配的。`process.memoryUsage()`可查看当前内存使用情况。
  * 内存使用限制是由垃圾回收机制引起，要回收内存过大时，反应时间较长，卡死其他任务，不可接受。
  * 可在启动 Node 时穿肚 `--max-old-space-size`、`--max-new-space-size` 调整内存限制大小。
* V8 的垃圾回收机制：
  * 基于分代式垃圾回收机制，即现代的垃圾回收算法中按对象的存活时间将内存的垃圾回收进行不同的分代，再针对不同分代的内存施以更高效的算法。
  * V8 的内存分代：
    * 新生代中为存活时间较短的对象，老生代中的对象为存活时间较长或者常驻内存的对象。
    * V8 堆的整体大小就是新生代所用内存加上老生代的内存大小。
    * 源代码中，老生代（max_old_generation_size_）设置为 64 位系统下为 1400MB，32 位为 700MB；新生代（2 个 `reserved_semispace_size`）共为 32MB 和 16MB；V8 堆内存的最大保留空间为 `4 * reserved_semispace_size + max_old_generation_size_`，即为 1464MB 和 732MB.
  * Scavenge 算法
    * 使用在新生代中的算法，主要使用 Cheney 算法实现。
    * 翻转：新生代堆内存一分为二，分为 From 空间（使用中）和 To 空间（闲置），进行垃圾回收时，检查 From 空间中的存活对象，复制到 To 空间，并释放非存活对象占用，后对换 From 和 To。分代式垃圾回收的前提下，存活周期长的对象会移动到老生代完成对象晋升。
    * 晋升：两个主要条件，经历过 Scavenge 回收，To 空间的内存占比超过限制。
  * Mark-Sweep & Mark-Compact
    * 老生代中使用的方式，老生代存活对象较多且声明周期较长，使用 Scavenge 不合适。
    * Mark-Sweep 标记清除。先标记阶段遍历标记堆中活着的对象。清除阶段清除没有被标记的对象。
    * 清除后内存空间出现不连续状态。对大内存的分配是不合适的。这时出现了 Mark-Compact 标记整理。将活着的对象移动到一端，然后清理掉边界外的内存。
  * Incremental Marking（增量标记）
    * 为了避免出现 JavaScript 应用逻辑与垃圾回收器看到的不一致的情况，垃圾回收的三种算法都要将应用全部停下来。
    * 新生代配置较小，且存活对象较少，可以容忍全停顿。
    * 使用增量标记法拆分为多“步进”，与 JavaScript 应用逻辑交替进行，直至标记阶段完成。
  * Lazy Sweeping、Incremental Compaction 等。

## 高效实用内存

* 作用域
  * 局部作用域，执行结束后销毁回收。
  * 全局作用域，程序退出后销毁回收。
  * 均可主动释放，实用 delete 或 重新赋值的方式，触发回收，但是其中 delete 可能干扰 v8 的优化。
* 闭包
  * 保持对执行完毕的函数的作用域内标识符（变量）的应用。
  * 可能引起内存回收问题。

## 内存指标

* 一些查看内存的api：
  * process.memoryUsage()：查看 Node 进程的内存占用情况。{heapTotal: 堆中申请的内存, heapUsed: 堆中使用的内存量, rss: 进程常驻内存}
  * os.totalmem()：查看系统的总内存。
  * os.freemem()：查看系统的闲置内存。
* 不通过 V8 进行分配的内存是堆外内存，如 **Buffer** 对象即不经过 V8 的内存分配，可以利用堆外内存一定程度上突破内存限制问题。

## 内存泄漏

* 常见原因：
  1. 缓存
  2. 队列消费不及时
  3. 作用域未释放
* 将内存当做缓存使用时应，限制缓存对象或数组的长度（先进先出的淘汰机制等）。
* 使用第三方缓存工具进行缓存如 Redis 等。
* 队列其实类似于数组缓存，使用队列限制 io 的操作并发等，但是当消费速度小于生产速度时，会造成队列的无限增长。

## 内存泄漏排查

第三方工具

## 大内存应用

针对大文件的读写使用 stream api。

# 第六章 理解 Buffer

## Buffer 结构

Buffer 是一个像 Array 的对象。模块代码中性能相关的有 C++ 实现，非性能的由 JavaScript 实现。

* Buffer 对象
  Buffer 对象每一项为 16 进制的两位数，即 0 到 255。
  * new Buffer(n)，创建长度为 n 字节的 Buffer 对象。
  * 可通过 length 访问长度。
  * 可通过下标赋值，如果赋值为非 0 - 255 的数，会进行处理，模 255 余数取正，或省略小数部分。

* Buffer 内存分配
  * Buffer 占用内存是堆外内存。大内存的使用不能采用使用一点申请一点的方式，采用的是在 C++ 层面申请内存，在 JavaScript 中分配内存的策略。
  * Node 采用 slab 分配机制（动态内存管理机制），即 slab 是一块申请好的固定大小的内存区域，有三种状态:
    * full：完全分配状态
    * partial：部分分配状态
    * empty：没有被分配状态
  * Node 以 8KB 为界限来区分 Buffer 是大对象还是小对象。8KB 也是每个 slab 的大小值，在 JavaScript 层面，以它作为单位单元进行内存分配。

1. 分配小 Buffer 对象，小于 8KB 的 Buffer 对象：
使用中间量 pool 指向待分配的 slab 单元，如果 Buffer 的大小小于待分配的 slab 大小，则直接分配给 Buffer，并记录已分配字节，Buffer 同时记录使用的 slab 的区域。否则构建新的 slab 单元。
2. 分配大 Buffer 对象。直接分配一个 SlowBuffer 对象作为 slab 单元，由大 Buffer 对象独占。

同时由于一个 slab 可能分配给多个 Buffer，只有占用 slab 的 Buffer 都可以回收时，此 slab 才能被回收。

## Buffer 转换

Buffer 对象与字符串之间可以互转，目前支持的字符串编码类型有：ASCII、UTF-8、UTF-16LE/UCS-2、Base64、Binary、Hex。

* 字符串转 Buffer:
  ```
  new Buffer(str, [encoding])
  ```
  不传 encoding 则默认 UTF-8
* 写入
  ```
  buf.write(string, [offset], [length], [encoding])
  ```
  一个 Buffer 可写入不同编码的内容。
* Buffer 转字符串
  ```
  buf.toString([encoding], [start], [end])
  ```
* 不支持的编码类型需要借助第三方库

## Buffer 的拼接

```
var rs = fs.createReadStream('test.md')
var data = ''
rs.on('data', function (chunk) {
  data += chunk
})
```

* 截断：当我们使用这种 `data += chunk` 拼接 Buffer 时，其实是自动调用了 `data.toString() + chunk.toString()`，在这种情况下，像宽字节的中文可能会出现截断，导致表示一个中文汉字的字节被分开转换，导致乱码。
* 初步解决：通过设置可读流的 encode ，即 `rs.setEncoding('utf-8')`，内部使用 decoder 对象，会对长度不够的部分暂存，与下一个串拼接转换。但是只支持 UTF-8、Base64、UCS-2/UTF-16LE。
* 完整解决：数组接收，`Buffer.concat(chunks, size)`转换，然后输出

## Buffer 性能

* 减少字符串和 Buffer 的转换，静态数据提前转换为 Buffer，无须再每次响应时进行转换
* 文件读取时的 highWaterMark 参数设置，其对 Buffer 内存的分配和使用有一定影响，同时设置过小时，可导致系统调用次数过多

# 第七章 网络编程

node 提供了 net、dgram、http、https 四个模块，分别用于处理 TCP、UDP、HTTP、HTTPS，适用于服务器端和客户端。网络基础部分知识省略，见其他文章。

## 创建 TCP 服务

使用 net 模块

```js
const net = require('net')
const server = net.createServer(socket => {
  socket.on('data', () => {
    socket.write('回复')
  })
})
// 监听
server.listen(8124, () => {
  console.log('server bound')
})
```

* TCP 服务的事件
  * 服务器事件
    * listening：绑定端口或 Domain Socket 后触发
    * connection：每个客户端套接字连接到服务器端时触发
    * close：服务器关闭时触发，server.close() 后停止接收新的套接字连接，但是保持当前存在的连接，所有连接断开后触发
    * error：异常时
  * 连接事件
    * data：一端调用 write() 发送数据时触发，由于对数据的优化算法（如集中发送小数据的 Nagle 算法）的存在，不是每次 write 都会触发 data 事件
    * end：任意一段发送了 FIN 数据时触发
    * connect：用于客户端，套接字与服务器端连接成功时触发
    * drain：任意一段调用 write() 发送数据时，当前端触发
    * error：异常时
    * close：套接字完全关闭时触发
    * timeout：当一定时间后连接不在活跃是触发

## 构建 UDP 服务

```js
const dgram = require('dgram')
const server = dgram.createSocket('udp4')
server.bind(41234) // 端口监听
server.on('xxx', fn) // message、listening 事件的监听
```
* UDP 套接字事件
  * message：UDP 套接字侦听网卡端口后接收到消息时，数据为 Buffer 对象和一个远程地址信息
  * listening：UDP 套接字开始侦听时触发该消息
  * close：调用 close() 时触发，并不再触发 message 事件，需再次触发时需重新绑定
  * error：异常时

## 构建 HTTP 服务

HTTP 网络知识略

* http 模块：node 中 http 模块继承自 TCP 服务器（net 模块）
* 请求部分：
  * 报文头很简单使用 req 或 req.headers 直接访问
  * 报文体：抽象为只读流对象，需要在数据流结束后才能进行对报文体的操作
  ```js
  function (req, res) {
    let buffers = []
    req.on('data', (trunk) => {
      buffers.push(trunk)
    }).on('end', () => {
      const buffer = Buffer.concat(buffers)
    })
  }
  ```
* 响应部分：可将其看成一个可写的流对象
  * 响应头：
    * setHeader：可以使用 setHeader 进行多次设置
    * writeHeader：只有调用 writeHead 后报头才会写入连接中
  * 响应体：res.write() 和 res.end()，后者会结束当前响应
    * 一旦开始发送数据，不可再设置 header
  * 事件：
    * connection：连接建立时
    * request：请求数据发送到服务器端
    * close：与 TCP 的 close 相同
    * checkContinue：某些客户端发送较大数据时会先发送一个头部带有 Expect：100-continue 的请求到服务器。客户端收到 100 Continue 后重新发起请求时才会触发 request 事件
    * connect：客户端发起 CONNECT 请求时
    * upgrade：客户端要求升级连接的协议时，见 WebSocket 部分
    * clientError：连接的客户端触发 error 事件时
* HTTP 客户端
  * 响应：解析完响应头触发 response 事件，传递响应对象以供操作，后续响应报文体以只读流的方式提供
  * 代理：在 keepalive 的情况下一个底层会话连接可以多次用于请求，但是是有上限的，通过 http 模块的默认客户端代理对象 http.globalAgent 管理，实质是一个连接池，同时发送的请求在超出上限时会等待前面的请求完成

## 构建 WebSocket 服务

* WebSocket 客户端基于事件的编程模型和 Node 中自定义事件相差无几
* WebSocket 实现了客户端与服务器端之间的长连接，而 Node 中自定义事件相差无几
基于以上两点，Node 和 WebSocket 很契合
WebSocket 协议主要分为两部分：握手和数据传输。握手是由 HTTP 完成的。

* 握手
  1. 通过 HTTP 发起请求报文，两个特殊协议头 `Upgrade: websocket` 和 `Connection: Upgrade` 表示请求服务器端升级协议为 WebSocket。
  2. Sec-WebSocket_key 字段的 随机 Base64 编码字符串的值会被服务器端混合并试用 sha1 安全散列算法计算结果后进行 Base64 编码返回客户端。用于安全校验。
  3. Sec-WebSocket-Protocol 和 Sec-WebSocket-Version 字段用于指定子协议和版本号。
  4. 服务器端处理完成后，发送给客户端，客户端将校验 Sec-webSocket-Accept 的值，成功则开始数据传输
* 数据传输
  1. 握手完成后，客户端的 onopen 会被触发执行
  2. 后续使用 send 方法和对应的 message 监听完成数据传输
  3. 安全上，客户端需要对发送的数据帧进行掩码处理，而服务端不需要。换言之，服务端收到无掩码数据或客户端收到掩码数据，连接将关闭

## 安全

Node 在 网络安全方面提供了三个模块，crypto（加解密）、tls、https。

HTTPS 网络知识略

HTTPS 服务相对于 HTTP 差别只是在证书相关参数上
const http = require('http')

const Vue = require('vue')
const renderer = require('vue-server-renderer').createRenderer()
const port = 8089

// 创建服务
let server = http.createServer((req, res) => {
  // 实例化vue
  const app = new Vue({
    data: {
      name: 'demo'
    },
    template: `<div>当前预览页面为{{name}}</div>`
  })
  // 渲染为字符串
  renderer.renderToString(app)
    .then(html => {
      // 成功返回
      res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
      res.end(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <title>demo</title>
        <head>
        <body>${html}<body>
      </html>
      `)
    })
    // 错误返回
    .catch(err => {
      console.log(err)
      res.writeHead(500, {'Content-Type': 'text/plain; charset=utf-8'});
      res.end('服务端错误')
    })
})
// 开启服务
server.listen(port)
// 服务状态提示
console.log(`服务运行在：http://127.0.0.1:${port}`)
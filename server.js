const http = require('http')
const fs = require('fs')
const path = require('path')
const { createBundleRenderer } = require('vue-server-renderer')

const serverBundle = require('./dist/vue-ssr-server-bundle.json')
const clientManifest = require('./dist/vue-ssr-client-manifest.json')
const template = fs.readFileSync('./src/template.html', 'utf-8')

const port = 8089

const renderer = createBundleRenderer(serverBundle, {
  runInNewContext: false, // 推荐
  template, // （可选）页面模板
  clientManifest // （可选）客户端构建 manifest
})

// 创建服务
let server = http.createServer((req, res) => {
  console.log(req.url)
  // dist 静态文件服务
  if (req.url.indexOf('/dist/') === 0) {
    fs.readFile(path.join('.', req.url), (err, data) => {
      if (err) {
        res.writeHead(404)
        res.end('文件不存在')
      } else {
        res.end(data)
      }
    })
  } else {
    // 匹配 vue
    const context = {
      url: req.url
    }
    // 渲染为字符串
    renderer.renderToString(context)
      .then(html => {
        // 成功返回
        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
        res.end(html)
      })
      // 错误返回
      .catch(err => {
        console.log(err)
        res.writeHead(500, {'Content-Type': 'text/plain; charset=utf-8'});
        res.end('服务端错误')
      })
  }
})
// 开启服务
server.listen(port)
// 服务状态提示
console.log(`服务运行在：http://127.0.0.1:${port}`)
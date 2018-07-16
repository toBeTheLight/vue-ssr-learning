const http = require('http')
const fs = require('fs')
const path = require('path')
const express = require('express')
const favicon = require('serve-favicon')
const { createBundleRenderer } = require('vue-server-renderer')

const serverBundle = require('./dist/vue-ssr-server-bundle.json')
const clientManifest = require('./dist/vue-ssr-client-manifest.json')
const templatePath = './src/template.html'
const setupDevServer = require('./build/setup-dev-server')

const port = 8089
const isProd = process.env.NODE_ENV === 'production'

const app = express()

let renderer, readyPromise
if (isProd) {
  // 生产模式
  renderer = createBundleRenderer(serverBundle, {
    runInNewContext: false, // 推荐
    template: fs.readFileSync(templatePath, 'utf-8'), // （可选）页面模板
    clientManifest // （可选）客户端构建 manifest
  })
} else {
  // 开发模式
  readyPromise = setupDevServer(
    app,
    templatePath,
    (bundle, options) => {
      console.log('初始化开发服务')
      renderer = createBundleRenderer(bundle, options)
    }
  )
}

function render (req, res) {
  console.log(req.url)
  const context = {
    url: req.url
  }
  // 渲染为字符串
  const promise = renderer.renderToString(context)
  console.log('返回渲染结果')
    promise.then(html => {
      // 成功返回
      res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
      res.end(html)
    })
    // 错误返回
    .catch(err => {
      console.log('错误原因：', err)
      res.writeHead(500, {'Content-Type': 'text/plain; charset=utf-8'});
      res.end('服务端错误')
    })
}
// 静态资源服务
app.use('/dist', express.static(path.resolve(__dirname, './dist')))
app.use(favicon('./public/favicon.ico'))
// 创建服务
app.get('*', isProd ? render : (req, res) => {
  console.log('接到请求')
  readyPromise.then(() => {
    return render(req, res)
  })
})
// 开启服务
app.listen(port, () => {
  // 服务状态提示
  console.log(`server started at http://127.0.0.1:${port}`)
})
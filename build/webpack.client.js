const webpack = require('webpack')
const merge = require('webpack-merge')
const base = require('./webpack.base')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')
const NODE_ENV = process.env.NODE_ENV || 'development'
const config = merge(base, {
  mode: NODE_ENV,
  entry: {
    app: './src/entry-client.js'
  },
  resolve: {
    alias: {
      'create-api': './create-api-client.js'
    }
  },
  optimization: {
    splitChunks: {
      chunks: "all",
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all"
        },
        commons: {
          // async 设置提取异步代码中的公用代码
          chunks: "async",
          name: 'commons-async',
          /**
           * minSize 默认为 30000
           * 想要使代码拆分真的按照我们的设置来
           * 需要减小 minSize
           */
          minSize: 0,
          // 至少为两个 chunks 的公用代码
          minChunks: 2
        }
      }
    },
    /**
     * 对应原来的 minchunks: Infinity
     * 提取 webpack 运行时代码
     * 直接置为 true 或设置 name
     */
    runtimeChunk: {
      name: 'manifest'
    }
  },
  plugins: [
    // strip dev-only code in Vue source
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': `"${NODE_ENV}"`,
      'process.env.VUE_ENV': '"client"'
    }),
    new VueSSRClientPlugin()
  ]
})

module.exports = config
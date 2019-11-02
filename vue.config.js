const CompressionPlugin = require("compression-webpack-plugin")
module.exports = {
    publicPath:"/",
    assetsDir: "static",
    //加速生产环境构建
    productionSourceMap: false,
    configureWebpack: config => {
        if (process.env.NODE_ENV === "production") {
            return {
                plugins: [new CompressionPlugin({
                    test: /\.js$|\.html$|\.css/,
                    threshold: 10240,
                    deleteOriginalAssets: false
                })]
            }
        }
    },
    css: {
        sourceMap: false
    },
    devServer: {
        port: "8080", //代理端口
        open: false, //项目启动时是否自动打开浏览器，我这里设置为false,不打开，true表示打开
        proxy: {
            "/localapi": {
                target: "http://127.0.0.1:8090", //服务器api地址
                changeOrigin: true, //是否跨域
                ws: true, // proxy websockets
                pathRewrite: {
                    //重写路径
                    "^/localapi": ""
                }
            }
        }
    },
}
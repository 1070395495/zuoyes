module.exports = {
    lintOnSave: false, // 是否进行对代码用ESlint检验，false代表不检验
    devServer: {
        port: 9999,
        // proxy: {
        //     '/api': {
        //         target: 'https://m.genshuixue.com',
        //         ws: true,
        //         changeOrigin: true,
        //         pathRewrite: {
        //             '^/api': '/' // 这里理解成用'/api'代替target里面的地址,比如我要调用'http://40.00.100.100:3002/user/add'，直接写'/api/user/add'即可
        //         }
        //     }
        // }
    },
    chainWebpack: config => {
        // console.log('config:::', config.plugin('define'))
        config
            .plugin('define')
            .tap(args => {
                args[0]['process.env'].BUILD_ENV = JSON.stringify(process.env.BUILD_ENV)
                return args;
            })
    }
   

}

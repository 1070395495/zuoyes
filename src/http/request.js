// 基本不用封装，只是对请求的接口地址，超时，报错处理
import Axios from 'axios'
// Axios.defaults.withCredentials = true
 
//console.log('request.js中的环境变量:', process.env.BUILD_ENV)

// 针对npm run 来自动读取不同环境变量
const config_env = require(`../build/${process.env.BUILD_ENV}.js`)

// 创建axios实例
const service = Axios.create({
    baseURL: 'https://www.liulongbin.top:8888/api/private/v1',
    timeout: 3000
})

// 请求拦截
service.interceptors.request.use(config => {
    //console.log('请求被拦截:', config)
  const token = localStorage.getItem('token')
  //配置头信息
  if(token)
  {
    config.headers["Authorization"] = token;
  }
    return config;
}, _error => {
  // eslint-disable-next-line prefer-promise-reject-errors
  return Promise.reject('请求出错，请检查')
})

// 响应拦截
service.interceptors.response.use(res => {
    //console.log('响应拦截')
    return res;
}, error => {
  // eslint-disable-next-line prefer-promise-reject-errors
  return Promise.reject('出错啦', error)
})

export default service

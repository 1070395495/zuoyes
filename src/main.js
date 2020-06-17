import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Vant from 'vant'
import 'vant/lib/index.css'
// 引入http
// import http from './http/request'
import axios from "axios"
import Bus from "../utils/Bus"
import ElementUI from 'element-ui';
Vue.use(ElementUI);
import 'element-ui/lib/theme-chalk/index.css';
Vue.prototype.$bus = Bus;
// 挂载到Vue原型上
Vue.prototype.$axios = axios;
Vue.use(Vant)

// //引入reset  
import '@/assets/reset.css'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

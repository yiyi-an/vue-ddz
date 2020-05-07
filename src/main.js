import 'normalize.css/normalize.css'
import Vue from 'vue'
import VueSocketIO from 'vue-socket.io'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './style/index.scss'

import Barrage from './components/Barrage'

import App from './App.vue'
import store from './store'

import '../utils/prevent'

Vue.config.productionTip = false

Vue.use(ElementUI,{
  size:'mini'
});
Vue.use(Barrage)

Vue.use(new VueSocketIO({
  debug: true,
  // 服务器端地址
  connection: '//123.206.204.35:10068',
  // connection: '//ddz.dodolib.cn:10068',
  vuex: {
    store
  }
}))

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')

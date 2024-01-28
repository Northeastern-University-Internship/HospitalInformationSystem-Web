import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import Element from 'element-ui'
import "element-ui/lib/theme-chalk/index.css"
// import locale from 'element-ui/lib/locale/lang/en';

import axios from "./axios";
import qs from 'qs';
import './assets/global.css'

Vue.config.productionTip = false

Vue.use(Element);
// Vue.use(ElementUI, { locale });

Vue.prototype.$axios = axios;
Vue.prototype.$qs = qs;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

/* eslint-disable */
import Vue from 'vue'
import 'element-ui/lib/theme-chalk/index.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import 'mdi/css/materialdesignicons.css'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import vuetify from './plugins/vuetify'
Vue.use(ElementUI)

new Vue({
  vuetify,
  router,
  store,
  render: h => h(App)
}).$mount('#app')

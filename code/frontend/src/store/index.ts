/* eslint-disable */
import Vue from 'vue'
import Vuex from 'vuex'
import Stock from './modules/stock'
Vue.use(Vuex)
const store = new Vuex.Store({
  modules: {
    'Stock': Stock
  }
})
export default store

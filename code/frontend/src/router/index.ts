/* eslint-disable */
import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  }, {
    path: '/c1',
    name: 'c1',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/C1.vue')
  }, {
    path: '/c2',
    name: 'c2',
    component: () => import('../views/C2.vue')
  }, {
    path: '/c3',
    name: 'c3',
    component: () => import('../views/C3.vue')
  },
   {
    path: '/c6',
    name: 'c6',
    component: () => import('../views/C6.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router

// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import Users from '../pages/Users.vue'
import Articles from '../pages/Articles.vue'
import Orders from '../pages/Orders.vue'
import Login from '../pages/Login.vue'
import Dashboard from '../pages/Dashboard.vue'


const routes = [
  { path: '/', name: 'Dashboard', component: Dashboard },
  { path: '/users', name: 'Users', component: Users },
  { path: '/articles', name: 'Articles', component: Articles },
  { path: '/orders', name: 'Orders', component: Orders },
  { path: '/login', name: 'Login', component: Login }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})



router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('auth') === 'true'

  if (to.path !== '/login' && !isAuthenticated) {
    next('/login')
  } else {
    next()
  }
})


export default router

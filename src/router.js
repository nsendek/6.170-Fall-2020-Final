import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'main',
      component: () => import('./views/Main.vue')
    }, 
    {
      path: '/login',
      name: 'login', 
      component: () => import('./views/LoginPage.vue')
    }, 
    {
      path: '/user-profile',
      name: 'user-profile',
      component: () => import('./views/UserProfilePage.vue')
    }
  ],
  linkActiveClass: "active",
  linkExactActiveClass: "exact-active"
})

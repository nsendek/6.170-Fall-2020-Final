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
    },
    {
      path: '/business-profile',
      name: 'business-profile',
      component: () => import('./views/BusinessProfilePage.vue')
    },
    {
      path: '/business/:id',
      name: 'business', 
      component: () => import('./views/BusinessView.vue')
    }
  ],
  linkActiveClass: "active",
  linkExactActiveClass: "exact-active"
})

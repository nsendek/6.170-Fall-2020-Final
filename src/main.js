import Vue from 'vue'
import VueCookie from 'vue-cookie'
import App from './App.vue'
import router from './router'

Vue.use(VueCookie);

export const eventBus = new Vue();

Vue.config.productionTip = false

// global state
Vue.prototype.$state = Vue.observable({});

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

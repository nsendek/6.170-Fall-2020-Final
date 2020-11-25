import Vue from 'vue'
import VueCookie from 'vue-cookie'
import Vuetify from 'vuetify/lib';

import App from './App.vue'
import router from './router'
import * as VueGoogleMaps from 'vue2-google-maps'


Vue.use(Vuetify);
const vuetify = new Vuetify({});

Vue.use(VueCookie);

Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyDKOlyw5FKzfofKtyQ5jfKFuleqelf1nhQ',
    // libraries: 'places',
  },
  installComponents: true
})

export const eventBus = new Vue();

Vue.config.productionTip = false

// global state
Vue.prototype.$state = Vue.observable({ username : "", isBusiness : false, businesses : []});

new Vue({
  router, 
  vuetify,
  render: h => h(App)
}).$mount('#app')

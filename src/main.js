import Vue from 'vue'
import Vuetify from 'vuetify/lib';
import VueCookie from 'vue-cookie'

import App from './App.vue'
import router from './router'
import * as VueGoogleMaps from 'vue2-google-maps'

import "./assets/styles/web.css";

Vue.use(VueCookie);
Vue.use(Vuetify);
const vuetify = new Vuetify({
  theme: {
    options: {
      customProperties: true
    },
    themes: {
      light: {
        nav : "#fff",
        background : "#fff",
        splitter : "#eee",
        'splitter-handle' : "#424242"
        // primary: "#fff",
        // background : "#ff0",
        // accent: "#0f0",
        // secondary: "#f00",
        // anchor :  "#00f", 
        // success: "#0f0",
        // info: "#00f",
        // warning: "#ff0",
        // error: "#f00"
      },
      dark : {
        nav : "#121212",
        background : "#121212",
        splitter : "#424242",
        'splitter-handle' : "#aaa"
      }
    }
  }
});

Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyDKOlyw5FKzfofKtyQ5jfKFuleqelf1nhQ',
    libraries: 'places,drawing,visualization',
    map_ids: "e492156a263e3bf5,4bd99df653a8171b"
  },
  installComponents: true
})

export const eventBus = new Vue();

Vue.config.productionTip = false

// global state
Vue.prototype.$state = Vue.observable({ username : "", id : 0, isBusiness : false});

new Vue({
  router, 
  vuetify,
  render: h => h(App)
}).$mount('#app')

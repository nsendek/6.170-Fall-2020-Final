import Vue from 'vue'
import Vuetify from 'vuetify/lib';
import VueCookie from 'vue-cookie'
import VueGoogleAutocomplete from 'vue-google-autocomplete'

import App from './App.vue'
import router from './router'
import * as VueGoogleMaps from 'vue2-google-maps'

import "./assets/styles/web.css";

Vue.use(VueCookie);
Vue.use(Vuetify);
Vue.use(VueGoogleAutocomplete);

export const vuetify = new Vuetify({
  theme: {
    options: {
      customProperties: true
    },
    themes: {
      light: {
        primary: "#0464CC",
        accent : "#C40CCC",
        nav : "#fff",
        overlay : "#fff",
        splitter : "#eee",
        'splitter-hover' : "#ddd",
        'splitter-handle' : "#424242",
        'button-group' : "#eee",
        'info-window' : "#fff"
      },
      dark : {
        primary: "#0464CC",
        accent : "#C40CCC",
        nav : "#121212",
        overlay : "#121212",
        splitter : "#323232",
        'splitter-hover' : "#525252",
        'splitter-handle' : "#aaa",
        'button-group' : "#222",
        'info-window' : "#323232"
      }
    }
  },
  icons : {
    values: {
      '6_ft_apart' : {
        component: () => import("./assets/icons/6_ft_apart.vue")
      },
      'adequate_supplies' : {
        component: () => import("./assets/icons/adequate_supplies.vue")
      },
      'curbside_pickup' : {
        component: () => import("./assets/icons/curbside_pickup.vue")
      },
      'disinfection' : {
        component: () => import("./assets/icons/disinfection.vue")
      },
      'indoor_dining' : {
        component: () => import("./assets/icons/indoor_dining.vue")
      },
      'low_density' : {
        component: () => import("./assets/icons/low_density.vue")
      },
      'masks_required' : {
        component: () => import("./assets/icons/masks_required.vue")
      },
      'outdoor_dining' : {
        component: () => import("./assets/icons/outdoor_dining.vue")
      },
      'trained_workers' : {
        component: () => import("./assets/icons/trained_workers.vue")
      },
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


import Vue from 'vue'
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

const vuetify = new Vuetify({
  theme: {
    options: {
      customProperties: true
    },
    themes: {
      light : {
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

export default vuetify;
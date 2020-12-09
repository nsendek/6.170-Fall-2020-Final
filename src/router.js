import Vue from 'vue';
import Router from 'vue-router';

import Main from './views/Main.vue';
import BusinessView from './views/BusinessView.vue';

Vue.use(Router)

const router =  new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'main',
      components: { 
        default : Main
      }
    },
    {
      path: '/business/:id',
      name: 'business', 
      components: {
        default : BusinessView
      }
    },
    {
      path: '/business/:id/review',
      name: 'review', 
      components: {
        default : BusinessView,
        overlay : () => import('./views/ReviewPage.vue')
      }
    },
    {
      path: '/login',
      name: 'login', 
      components: {
        overlay: () => import('./views/LoginPage.vue')
      },
      beforeEnter: setDefault
    }, 
    {
      path: '/user-profile',
      name: 'user-profile',
      components: {
        overlay: () => import('./views/UserProfilePage.vue')
      },
      beforeEnter: setDefault
    },
    {
      path: '/business-profile',
      name: 'business-profile',
      components: {
        overlay : () => import('./views/BusinessProfilePage.vue')
      },
      beforeEnter: setDefault
    },
    {
      path: '/search',
      name: 'search',
      components: { 
        default : () => import('./views/SearchView.vue')
      }
    },
    {
      path: '*',
      name: 'notfound',
      components: {
        overlay: () => import('./views/NotFound.vue')
      },
      beforeEnter: setDefault
    },
  ],
})

/**
 * Vue Router doesn't have a simple way to dynamically 
 * change the the default vue component for a route 
 * (i.e. i want default to be the last viewed component: either Main or BusinessView)
 * This function manually sets it (if called in beforeEnter)
 */
function setDefault(to, from, next) {
  let routes = router.options.routes;
  let components;
  routes.forEach((route,idx) => {
    if (route.name == to.name) components = routes[idx].components
  })
  if (!components) return;

  // pick last viewed component (BusinessView or Main for now but there could be more) 
  if (from.name == "business") components.default = BusinessView;
  else if (from.name == "main") components.default = Main;

  next();
}

export default router;
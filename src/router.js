import Vue from 'vue';
import Router from 'vue-router';

import Main from './views/Main.vue';
import BusinessView from './views/BusinessView.vue';

import LoginPage from './views/LoginPage.vue';
import UserProfilePage from './views/UserProfilePage.vue';
import BusinessProfilePage from './views/BusinessProfilePage.vue';
import ReviewPage from './views/ReviewPage.vue';

Vue.use(Router)

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

  // pick either Main or just last viewed component (BusinessView for now but there could be more) 
  if (from.name == "business") components.default = BusinessView;
  else components.default = Main;

  next();
}

const router =  new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'main',
      component: Main
    },
    {
      path: '/business/:id',
      name: 'business', 
      component: BusinessView
    },
    {
      path: '/business/:id/review',
      name: 'review', 
      components: {
        default : BusinessView,
        overlay : ReviewPage,
      }
    },
    {
      path: '/login',
      name: 'login', 
      components: {
        overlay: LoginPage
      },
      beforeEnter: setDefault
    }, 
    {
      path: '/user-profile',
      name: 'user-profile',
      components: {
        overlay: UserProfilePage
      },
      beforeEnter: setDefault
    },
    {
      path: '/business-profile',
      name: 'business-profile',
      components: {
        overlay : BusinessProfilePage,
      },
      beforeEnter: setDefault
    }
  ],
})

export default router;
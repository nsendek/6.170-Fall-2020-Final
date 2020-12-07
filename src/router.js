import Vue from 'vue';
import Router from 'vue-router';

import Main from './views/Main.vue';
import BusinessView from './views/BusinessView.vue';

const NotFound = () => import('./views/NotFound.vue')
const BusinessProfilePage = () => import('./views/BusinessProfilePage.vue');
const UserProfilePage = () => import('./views/UserProfilePage.vue');
const LoginPage = () => import('./views/LoginPage.vue');
const ReviewPage = () => import('./views/ReviewPage.vue');
const SearchView = () => import('./views/SearchView.vue')

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
        overlay : ReviewPage
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
        overlay : BusinessProfilePage
      },
      beforeEnter: setDefault
    },
    {
      path: '/search',
      name: 'search',
      components: { 
        default : SearchView
      }
    },
    {
      path: '*',
      name: 'notfound',
      components: {
        overlay: NotFound
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
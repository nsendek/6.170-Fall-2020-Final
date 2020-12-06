<template>
  <v-app id="zelp">
    <NavBar />
    <EventHandler /> 
    <router-view name="overlay" />
    <v-main>

     <Panes>
       <template v-slot:left> 
          <router-view class = "scroll-box"/>  
       </template>
       <template v-slot:right> 
          <Map />
       </template>
     </Panes>

    </v-main>
  </v-app>
</template>
<script>
import Map from "./components/Map"; // only component that needs to be preloaded
// import Panes from "./components/Panes"

export default {
  components : {
    EventHandler : () => import("./components/EventHandler.vue"),
    NavBar : () => import("./components/NavBar"),
    Panes : () => import("./components/Panes"),
    Map,
    // Panes
  },
  beforeCreate() { // light and dark mode preference is saved using cookies
    let theme = this.$cookie.get("theme");
    this.$vuetify.theme.dark = theme == "dark" ? true : false;
  }
}
</script>
<!-- global styles -->
<style>
* {
  box-sizing: border-box;
}

body {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: var(--v-background-base);
  overflow: hidden !important; /* DON'T delete, prevents bug in safari */
  z-index: 0; 
}

body::-webkit-scrollbar {
  display: none; /* bug where empty scrollbar is always visible */
}

.scroll-box {
  height : calc(100vh - var(--navbar-height));
  overflow-y: scroll; 
}

</style>




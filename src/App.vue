<template>
  <v-app id="zelp">
    <NavBar />
    <EventHandler /> 
    <router-view name="overlay" />
    <v-main>

      <splitpanes class = "default-theme">
        <pane min-size="30"> 
          <router-view class = "scroll-box"/>  
        </pane>
        <pane min-size="30"> 
          <Map />
        </pane>
      </splitpanes>
      
    </v-main>
  </v-app>
</template>
<script>
import Map from "./components/Map"; // only component that needs to be preloaded
import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'

export default {
  components : {
    EventHandler : () => import("./components/EventHandler.vue"),
    NavBar : () => import("./components/NavBar"),
    Map,
    Splitpanes,
    Pane
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
  background-color: lavender;
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

.splitpanes--vertical > .splitpanes__splitter {
  min-width: 10px;
}
</style>




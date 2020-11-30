<template>
  <v-app id="zelp">
    <NavBar />
    <EventHandler /> 
    <router-view name="overlay" />
    <v-main>
      <v-row >
        <v-col  class ="left-col">
          <router-view class = "scroll-box"/>       
        </v-col>
        <v-col class ="right-col" >
          <Map />
        </v-col>
      </v-row>
    </v-main>
  </v-app>
</template>
<script>
import EventHandler from "./components/EventHandler.vue";
import NavBar from "./components/NavBar";
import Map from "./components/Map";

export default {
  components : {
    EventHandler,
    NavBar,
    Map
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
  /* z-index: 0;  */
}

.left-col {
  padding-top: 0px ; 
  padding-right:0px ;
  padding-bottom:0px ;
}

.right-col {
  padding-top: 0px ;  
  padding-left:0px ; 
  padding-bottom:0px ;
}
.scroll-box {
  /* DON'T delete below */
  height : calc(100vh - var(--navbar-height));
  overflow-y: scroll; 
}
</style>




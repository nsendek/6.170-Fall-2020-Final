<template>
  <v-app id="zelp">
    <NavBar />
    <EventHandler /> 
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
import Map from "./components/Map"

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
}

.left-col {
  padding-top: 0px; 
  padding-right:0px;
  padding-bottom:0px;
}

.right-col {
  padding-top: 0px; 
  padding-left:0px; 
  padding-bottom:0px;
}
.scroll-box {
  height : calc(100vh - 65px);
  height: -o-calc(100vh - 65px);
  height: -webkit-calc(100vh - 65px);
  height: -moz-calc(100vh - 65px);
  overflow-y: scroll;
}

.primary-header {
  font-size: 2.5em;
  text-align: center;
  margin: 20px;
}

.secondary-header {
  font-size: 2em;
  text-align: center;
}

.tertiary-header {
  font-size: 1.5em;
  text-align: center;
}

.quaternary-header {
  font-size: 1em;
  text-align: center;
}
</style>




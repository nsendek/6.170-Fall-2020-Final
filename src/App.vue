<template>
  <div id="app">
    <EventHandler /> 
    <router-view/>
  </div>
</template>
<script>
import EventHandler from "./components/EventHandler.vue";

export default {
  components : {
    EventHandler
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

.success-message {
  color: green;
  margin: auto;
}

.error-message {
  color: red;
  margin: auto;
}
</style>




<template>
  <v-app-bar app flat height="65px">

    <router-link to="/"> ZELP </router-link>
    
    <v-spacer></v-spacer>

    <div v-if="!this.$state.username"> 
      <router-link to="/login"> LOG IN </router-link>  
    </div> 
    <div v-else-if="this.$state.username && !(this.$state.isBusiness)"> 
      <div> <router-link to="/user-profile"> {{this.$state.username}} </router-link></div>
    </div> 
    <div v-else-if="this.$state.username && (this.$state.isBusiness)">
      <div> <router-link to="/business-profile"> {{this.$state.username}} </router-link></div>
    </div>

  </v-app-bar>
</template>
<script>

export default {
  name : "NavBar", 
}
</script>
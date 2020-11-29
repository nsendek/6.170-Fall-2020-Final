<template>
  <!-- var(--navbar-height) is defined in web.css -->
  <v-app-bar app color="white" flat height="var(--navbar-height)"> 

    <router-link to="/" class="zelp-logo"> <div class="zelp-logo"> ZELP  </div></router-link>
    
    <v-spacer></v-spacer>

    <div v-if="!this.$state.username"> 
      <router-link to="/login" class="nav-login-button"> <div class="nav-login-button"> LOG IN </div></router-link>  
    </div> 
    <div v-else-if="this.$state.username && !(this.$state.isBusiness)"> 
      <router-link to="/user-profile" class="nav-login-button"> <div class="nav-login-button"> {{this.$state.username}} </div></router-link>
    </div> 
    <div v-else-if="this.$state.username && (this.$state.isBusiness)">
      <router-link to="/business-profile" class="nav-login-button"> <div class="nav-login-button"> {{this.$state.username}} </div></router-link>
    </div>

  </v-app-bar>
</template>
<script>

export default {
  name : "NavBar", 
}
</script>
<style scoped>
header {
  /* DON'T delete, forces navbar to not auto grow/shrink or be absolute. also makes sure navbar is above overlay*/
  z-index : 10 !important;
  position: relative !important;
  max-height: var(--navbar-height) !important;
  min-height: var(--navbar-height) !important;
}
</style>
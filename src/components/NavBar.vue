<template>
  <div class="navbar">
    <div><router-link to="/"> ZELP </router-link></div> 
    <div v-if="this.$state.username == ''"> 
      <router-link to="/login"> LOG IN </router-link>  
    </div> 
    <div v-else-if="this.$state.username != '' && !(this.$state.isBusiness)"> 
      <div> <router-link to="/user-profile"> {{this.$state.username}} </router-link></div>
    </div> 
    <div v-else-if="this.$state.username != '' && (this.$state.isBusiness)">
      <div> <router-link to="/business-profile"> {{this.$state.username}} </router-link></div>
    </div>
  </div>
</template>

<script>

export default {
  name : "NavBar", 

  props : {
    showUserInfo : {default : true}
  }, 
}
</script>
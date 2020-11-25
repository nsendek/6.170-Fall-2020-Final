<template>
  <div class="navbar">
    <div><router-link to="/"> ZELP </router-link></div> 
    <div v-if="this.showUserInfo && this.$state.username == ''"> 
      <router-link to="/login"> LOG IN </router-link>  
    </div> 
    <div v-else-if="this.showUserInfo && this.$state.username != ''"> 
      <div> <router-link to="/user-profile"> {{this.$state.username}} </router-link></div>
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
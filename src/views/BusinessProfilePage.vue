<template>
  <div>
    <nav-bar />
    <business-profile />
  </div>
</template>

<script>
import BusinessProfile from '../components/BusinessProfile.vue'
import NavBar from "../components/NavBar.vue"

export default {
  name : "UserProfileVue",

  components : {
    BusinessProfile, 
    NavBar
  }
}
</script>
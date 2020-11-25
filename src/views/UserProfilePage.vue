<template>
  <div>
    <nav-bar />
    <user-profile />
  </div>
</template>

<script>
import UserProfile from '../components/UserProfile.vue'
import NavBar from "../components/NavBar.vue"

export default {
  name : "UserProfileVue",

  components : {
    UserProfile, 
    NavBar
  }
}
</script>
<template>
  <Overlay>
    <UserProfile />
  </Overlay>
</template>

<script>
import UserProfile from '../components/UserProfile.vue'
import Overlay from '../components/Overlay.vue'

export default {
  name : "UserProfileVue",

  components : {
    UserProfile, 
    Overlay 
  }
}
</script>
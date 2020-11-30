<template>
    <Overlay>
    <BusinessProfile/>
    </Overlay>
</template>

<script>
import BusinessProfile from '../components/BusinessProfile.vue'
import Overlay from '../components/Overlay.vue'

export default {
  name : "UserProfileVue",

  components : {
    BusinessProfile, 
    Overlay
  }
}
</script>
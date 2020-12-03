<template>
  <Overlay>
    <v-card class="overlay-card">
      <UserProfile />
    </v-card>
  </Overlay>
</template>

<script>
export default {
  name : "UserProfileVue",
  components : {
    UserProfile : () => import('../components/UserProfile.vue'), 
    Overlay : () => import('../components/Overlay.vue')
  }
}
</script>
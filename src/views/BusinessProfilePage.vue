<template>
    <Overlay>
        <v-card class="overlay-card">
          <BusinessProfile/>
        </v-card>
    </Overlay>
</template>

<script>
export default {
  name : "UserProfileVue",
  components : {
    BusinessProfile : () => import('../components/BusinessProfile.vue'),
    Overlay : () => import('../components/Overlay.vue')
  }
}
</script>
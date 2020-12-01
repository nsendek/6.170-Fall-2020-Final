<template>
    <Overlay>
    <BusinessProfile/>
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
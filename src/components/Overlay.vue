<template>
  <v-overlay 
    id='overlay'
    :light="$vuetify.theme.light"
    :dark="$vuetify.theme.dark"
    opacity="0"
    @click.native="hasHistory() ? $router.go(-1) : $router.push('/')"
  >
    <div @click="(e) => {e.stopPropagation();}">
      <slot> </slot>
    </div>
  </v-overlay>
</template>
<script>
export default {
  name : "Overlay",
  methods: {
    hasHistory() { return window.history.length > 2 }
  }
}
</script>
<style scoped>
#overlay {
  -webkit-backdrop-filter: blur(15px);
  backdrop-filter: blur(15px);
  min-width : 100vw;
  max-width : 100vw;
}

/* backdrop-filter not supported on some browsers */
@supports not (backdrop-filter: blur( 15px )) {
  #overlay {
    background-color: var(--v-background-base)!important;
    opacity: 0.95 !important;
  }
}
</style>
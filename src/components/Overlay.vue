<template>
  <v-overlay 
    id='overlay'
    :dark="false"
    opacity="0"
    @click.native="$router.go(-1)"
  >
    <div @click="(e) => {e.stopPropagation();}">
      <slot> </slot>
    </div>
  </v-overlay>
</template>
<script>
export default {
  name : "Overlay",
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
    background-color: rgba(255,255,255,0.9) !important;
  }
}
</style>
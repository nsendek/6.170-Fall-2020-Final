<template>
  <v-overlay 
    color="white"
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
.v-overlay {
  -webkit-backdrop-filter: blur(15px);
  backdrop-filter: blur(15px);
  min-width : 100vw;
  max-width : 100vw;
}
</style>
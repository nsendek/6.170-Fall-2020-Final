<template >
	<Overlay>
    <div class= "primary-header">
      PAGE NOT FOUND
    </div>
	</Overlay>
</template>
<script>
export default {
  name: "NotFound",
  components :{
    Overlay : () => import('../components/Overlay.vue') 
  }
}
</script>
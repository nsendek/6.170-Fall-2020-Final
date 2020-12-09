<template>
  <div>
		<slot> 
      <div class = "load">
        <v-progress-circular
        v-if="!quit"
        indeterminate
        color="secondary"
        size = "50"
        >
        </v-progress-circular>
        <div v-else class = "tertiary-header"> 
          No {{dataType}}
        </div>
      </div>	
    </slot>
	</div>
</template>

<script>

export default {
  name: "Feed",
  props : {
    dataType : {
      type : String,
      default : "Reviews"
    }
  },
  data: () => ({
      quit: false
  }),
  mounted() {
    setTimeout(() => {
      this.quit = true; 
    }, 3000)
  }
};
</script>
<style scoped>
  .load {
    margin: 100px;
    display: flex;
    flex-direction: row;
    justify-content: center;
  }
</style>
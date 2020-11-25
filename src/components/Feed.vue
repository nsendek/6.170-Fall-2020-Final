<template>
  <div class="flex-column" >
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
    }, 1000)
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
  .flex-column {
    display: flex;
    flex-direction: column;
  }
</style>
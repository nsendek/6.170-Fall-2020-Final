<template>
  <Overlay>
    <v-card class = "review" >
     
      <v-btn @click="router.go(-1)"> HELLO </v-btn> 
     
      <div>
        <v-chip style="margin: 5px;" :key="idx" v-for="(badge,idx) in badges">
          {{badge.label}}
        </v-chip>
      </div>
      
    </v-card>
  </Overlay>
</template>

<script>
import axios from "axios";
import Overlay from '../components/Overlay.vue'

export default {
  name : "UserProfileVue",
  data() {
    return {
      rating : 3,
      badges : [],
      badgeReacts : []
    }
  },
  components : {
    Overlay 
  },
  created() {
    this.loadBadges();
  },
  methods : {
    async postReview() {

    },
    async postBadgeReact() {

    },
    async loadBadges() {
      let response = await axios.get(`/api/business/${this.$route.params.id}/badges`)
          .catch(err => err.response);
      this.badges =  (response.status == 200) ? response.data : [];
    },
  }
}
</script>
<style scoped>
.review {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
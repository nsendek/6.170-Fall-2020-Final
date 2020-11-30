<template>
  <Overlay>
    <v-card class = "review" >

      <div> {{this.$route.params.business.name}} </div>

      <div> How would you rate your overall experience in terms of COVID-19 safety? </div>

      <v-rating
        v-model="rating"
        background-color="indigo lighten-3"
        color="indigo"
        large
      ></v-rating>
     
      <div>
        <v-chip style="margin: 5px;" :key="idx" v-for="(badge,idx) in badges">
          {{badge.label}}
        </v-chip>
      </div>

      <div><v-text-field v-model="reviewContent" label="comments" filled/></div>

      <v-btn @click="submitReview"> SUBMIT </v-btn> 
      
    </v-card>
  </Overlay>
</template>

<script>
import axios from "axios";
import Overlay from '../components/Overlay.vue'
import { eventBus } from "../main";

export default {
  name : "UserProfileVue",
  data() {
    return {
      rating : 3,
      badges : [],
      badgeReacts : [], 
      reviewContent : ""
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
      let response = await axios.get(`/api/business/${this.$route.params.business.id}/badges`)
          .catch(err => err.response);
      this.badges =  (response.status == 200) ? response.data : [];
    },

    submitReview : function() {
      axios.post("/api/review", {
        businessId : this.$route.params.business.id, 
        rating : this.rating, 
        content: this.reviewContent
      })
      .then((response) => {
        eventBus.$emit("success-message", response.data.message);
      }).catch((error) => { 
        eventBus.$emit("error-message", error.response.data.error); 
      });

      this.$router.go(-1);
    }
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
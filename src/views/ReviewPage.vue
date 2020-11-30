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
     Which of these did {{this.$route.params.business.name}} do well?
      <div>
        <v-chip @click ="reactBeforePost(idx,'affirm')" style="margin: 5px;" :key="idx" v-for="(badge,idx) in badges">
          {{badge.label}}
        </v-chip>
      </div>
     Which of these does {{this.$route.params.business.name}} need to improve in?
      <div>
        <v-chip @click ="reactBeforePost(idx,'deny')" style="margin: 5px;" :key="idx" v-for="(badge,idx) in badges">
          {{badge.label}}
        </v-chip>
      </div>

      <div><v-text-field v-model="reviewContent" label="comments" filled/></div>

      <v-btn @click="postReview"> SUBMIT </v-btn> 
      
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
      badgeReacts : {}, 
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
      let review = {
        businessId : this.$route.params.business.id, 
        rating : this.rating, 
        content: this.reviewContent
      };
      axios.post("/api/review",review)
      .then((response) => {
        eventBus.$emit("success-message", response.data.message);
        eventBus.$emit("review-posted", review);
      }).catch((error) => { 
        eventBus.$emit("error-message", error.response.data.error); 
      });
      this.postBadgeReact();
      this.$router.go(-1);
    },
    async postBadgeReact() {
      // Object(this.badgeReacts).keys.forEach((id) => axios.put(`/api/business/${id}/${this.badgereacts[id]}`).catch(err => err.response));
      Array(this.badgeReacts).forEach((badgereact) => console.log(badgereact));
    },
    async loadBadges() {
      let response = await axios.get(`/api/business/${this.$route.params.business.id}/badges`)
          .catch(err => err.response);
      this.badges =  (response.status == 200) ? response.data : [];
    },
    reactBeforePost(badgeid,react){
        this.badgeReacts[badgeid] = react;
        let background = (react == "affirm") ? "green" : "red";
        console.log(background,this.badgeReacts);
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
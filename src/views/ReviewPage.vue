<template>
  <Overlay>
    <v-card class = "review" >

      <div> {{business.name}} </div>

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

      <div><v-textarea style="width:400px;" width v-model="reviewContent" label="comments" filled/></div>

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
      business : {},
      rating : 3,
      badges : [],
      badgeReacts : [], 
      reviewContent : ""
    }
  },
  components : {
    Overlay 
  },
  beforeMount() {
    if (this.$route.params.business) this.business = this.$route.params.business;
    else this.loadBusiness();
    
    this.loadBadges();
  },
  methods : {
    async loadBusiness() {
      let response = await axios.get(`/api/business/${this.$route.params.id}`)
        .catch(err => err.response);
          
      if (response.status == 200) this.business = response.data;
      else this.$router.push({name : "notfound"});
    },
    async postBadgeReact() {

    },
    async loadBadges() {
      let response = await axios.get(`/api/business/${this.$route.params.id}/badges`)
          .catch(err => err.response);
      this.badges =  (response.status == 200) ? response.data : [];
    },

    submitReview : function() {
      let review = {
        businessId : this.$route.params.business.id, 
        rating : this.rating, 
        content: this.reviewContent
      };
      axios.post("/api/review",review )
      .then((response) => {
        eventBus.$emit("success-message", response.data.message);
        eventBus.$emit("review-posted", review);
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
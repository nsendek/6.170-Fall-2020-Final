<template>
  <Overlay>
    <v-card class = "review" >


      <div class="secondary-header"> {{business.name}} </div>

      <div class="quarternary-header review-spacing smaller-width"> How would you rate your overall experience in terms of COVID-19 safety? </div>

      <v-rating
        v-model="rating"
        background-color="indigo lighten-3"
        color="indigo"
        large
      ></v-rating>
     
      <div class="review-spacing">
        <center> Affirm Safety Policies </center>
        <v-spacer></v-spacer>
        <div>
          <v-btn-toggle
            class="badges-container"
            v-model="affirmedBadges"
            center
            background-color="button-group"
            borderless
            multiple
            >
            <v-tooltip 
              max-width="200px" top 
              v-for='(badge,index) in badges' v-bind:key="index"
              open-delay="500"
              z-index="20"
            >
              <template v-slot:activator="{ on }">
                <div v-on="on" style="margin: 10px 5px;">  
                  <BadgeIcon button :badgeLabel=badge.label :size="50" :border="10"/>
                </div>
              </template>
              <div style="text-align:center;"><b><u>{{badge.label}}</u></b></div>
              <div style="text-align:center;">{{badge.description}}</div>
            </v-tooltip>
          </v-btn-toggle>
        </div>
      </div>

      <div class="review-spacing">
        <center> Deny Safety Policies </center>
        <v-spacer></v-spacer>

        <div>
          <v-btn-toggle
            class="badges-container"
            v-model="deniedBadges"
            center
            background-color="button-group"
            borderless
            multiple
            >
            <v-tooltip 
              max-width="200px" top 
              v-for='(badge,index) in badges' v-bind:key="index"
              open-delay="500"
              z-index="20"
            >
              <template v-slot:activator="{ on }">
                <div v-on="on" style="margin: 10px 5px;">  
                  <BadgeIcon button :badgeLabel=badge.label :size="50" :border="10"/>
                </div>
              </template>
              <div style="text-align:center;"><b><u>{{badge.label}}</u></b></div>
              <div style="text-align:center;">{{badge.description}}</div>
            </v-tooltip>
          </v-btn-toggle>
        </div>
      </div>

      <div class="review-spacing"><v-textarea style="width:400px;" width v-model="reviewContent" label="comments" filled/></div>

      <v-btn v-if="!this.edit" @click="submitReview"> SUBMIT </v-btn> 
      <v-btn v-else @click="submitEdit"> SUBMIT </v-btn> 
      
    </v-card>
  </Overlay>
</template>

<script>
import axios from "axios";
import { eventBus } from "../main";


export default {
  name : "ReviewPage",
  data() {
    return {
      business : {},
      rating : 3,
      badges : [],
      affirmedBadges : [],
      deniedBadges: [],
      badgeReacts : [], 
      reviewContent : "",
      edit : false, 
      oldReview : {}
    }
  },
  components : {
    Overlay : () => import('../components/Overlay.vue'),
    BadgeIcon: () => import("../components/BadgeIconAlt"),
  },
  beforeMount() {
    if (this.$route.params.business) this.business = this.$route.params.business;
    else this.loadBusiness();

    if (this.$route.params.review) {
      let review = this.$route.params.review; 
      console.log(review); 
      this.rating = review.rating; 
      this.reviewContent = review.content; 
      this.edit = true; 
      this.oldReview = this.$route.params.review; 
    }
    
    this.loadBadges();
  },

  methods : {
    async loadBusiness() {
      let response = await axios.get(`/api/business/${this.$route.params.id}`)
        .catch(err => err.response);
          
      if (response.status == 200) this.business = response.data;
      else this.$router.push({name : "notfound"});

    },
    loadBadges: function() {
      axios.get(`/api/business/${this.$route.params.business.id}/badges`)
        .then((response) => {
          this.badges = response.data ? response.data : [];
          this.badges.forEach((badge) => {
            badge.denied = false;
            badge.affirmed = false
            });
        })
        .catch(err => err.response);
    },

    affirmBadges: function() {
      this.affirmedBadges.forEach((badgeIdx) => {
        axios.post(`/api/badge/affirm`, {
          badgeId: this.badges[badgeIdx].id
        })
        .then(() => {
          console.log("Affirm successful");
        })
        .catch((error) => {
          eventBus.$emit("success-message", error.response.error);
        })
      })
    },

    denyBadges: function() {
      this.deniedBadges.forEach((badgeIdx) => {
        axios.post(`/api/badge/deny`, {
          badgeId: this.badges[badgeIdx].id
        })
        .then(() => {
          console.log("Deny successful");
        })
        .catch((error) => {
          eventBus.$emit("success-message", error.response.error);
        })
      })
    },
    
    submitReview : function() {
      let review = {
        businessId : this.$route.params.business.id, 
        rating : this.rating, 
        content: this.reviewContent
      };
      axios.post("/api/review", review)
      .then((response) => {
        eventBus.$emit("success-message", response.data.message);
        eventBus.$emit("review-posted", review);
        this.affirmBadges();
        this.denyBadges();
      }).catch((error) => { 
        eventBus.$emit("error-message", error.response.data.error); 
      });
      this.$router.go(-1);
    }, 

    submitEdit : function () {
      // remove all previous affirms / denies 
      axios.delete(`/api/badge/affirmations/${this.business.id}`).
      then(() => {
        //delete old review
        axios.delete(`/api/review/${this.oldReview.id}`).then(() => {
          // make new review 
          this.submitReview(); 
        }).catch((error) => {
          eventBus.$emit("error-message", error + "uh-oh something went wrong"); 
        });
      }).catch((error) =>{
        console.log("affirms broken"); 
        eventBus.$emit("error-message", error + "delete affirms not working");
      });
    }
  }
}
</script>
<style scoped>
.review {
  display: flex;
  flex-direction: column;
  align-items: center;  
  padding: 50px; 
}

.review-spacing{
  margin-top: 20px; 
}

.smaller-width{
  width: 70%; 
  text-align: center;
}

</style>
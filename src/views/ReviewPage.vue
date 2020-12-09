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

        <v-chip-group
        column 
        multiple 
        active-class="affirmed">

          <v-chip style="margin: 5px;"
          :key="idx"
            v-for="(badge,idx) in badges"
            v-on:click = 'toggleAffirm(idx)'
            filter
            >
            {{badge.label}}
          </v-chip>
        </v-chip-group>
      </div>

      <div class="review-spacing">
        <center> Deny Safety Policies </center>
        <v-spacer></v-spacer>

        <v-chip-group
        column 
        multiple 
        active-class="denied">

          <v-chip style="margin: 5px;"
            :key="idx"
            v-for="(badge,idx) in badges"
            v-on:click = 'toggleDeny(idx)'
            filter
            >
            {{badge.label}}
          </v-chip>
        </v-chip-group>
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
      badgeReacts : [], 
      reviewContent : "",
      edit : false, 
      oldReview : {}
    }
  },
  components : {
    Overlay : () => import('../components/Overlay.vue') 
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

    toggleAffirm: function(idx) {
      this.badges[idx].affirmed = this.badges[idx].affirmed ?
                                    false : true;
    },

    toggleDeny: function(idx) {
      this.badges[idx].denied = this.badges[idx].denied ?
                                    false : true;
    },

    affirmBadges: function() {
      this.badges.filter((badge) => badge.affirmed).forEach((badge) => {
        axios.post(`/api/badge/affirm`, {
          badgeId: badge.id
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
      this.badges.filter((badge) => badge.denied).forEach((badge) => {
        axios.post(`/api/badge/deny`, {
          badgeId: badge.id
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

.v-chip.affirmed {
  background: rgb(73, 214, 73);
}

.v-chip.denied {
  background: rgb(240, 19, 19);
}

</style>
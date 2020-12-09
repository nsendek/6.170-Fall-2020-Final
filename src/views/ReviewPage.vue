<template>
  <Overlay>
    <v-card class = "review" >


      <div class="big-title"> {{business.name}} </div>

      <div class="quarternary-header review-spacing smaller-width"> How would you rate your overall experience in terms of COVID-19 safety? </div>

      <v-rating
        v-model="rating"
        background-color="indigo lighten-3"
        color="indigo"
        large
      ></v-rating>
     
      <div class="review-spacing">
        <center> Affirm Safety Policies </center>
          <v-btn-toggle
            class="badges-container"
            v-model="affirmedBadges"
            center
            borderless
            multiple
            >
            <v-tooltip 
              max-width="200px" bottom 
              v-for='(badge,index) in badges' v-bind:key="index"
              open-delay="500"
              z-index="20"
            >
              <template v-slot:activator="{ on }">
                <div v-on="on" style="margin: 10px 5px;">  
                  <BadgeIcon button :badgeLabel=badge.label :size="50" :border="10" :color="affirmedBadges.some(b => b.id == badge.id) ? 'green' : null"/>
                </div>
              </template>
              <div style="text-align:center;"><b><u>{{badge.label}}</u></b></div>
              <div style="text-align:center;">{{badge.description}}</div>
            </v-tooltip>
          </v-btn-toggle>

        <!-- <v-chip-group
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
        </v-chip-group> -->
      </div>

      <div class="review-spacing">
        <center> Deny Safety Policies </center>

        <!-- <v-chip-group
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
        </v-chip-group> -->

          <v-btn-toggle
            class="badges-container"
            v-model="deniedBadges"
            center
            borderless
            multiple
            >
            <v-tooltip 
              max-width="200px" bottom 
              v-for='(badge,index) in badges' v-bind:key="index"
              open-delay="500"
              z-index="20"
            >
              <template v-slot:activator="{ on }">
                <div v-on="on" style="margin: 10px 5px;">  
                  <BadgeIcon button :badgeLabel=badge.label :size="50" :border="10" :color="deniedBadges.includes(badge) ? 'red' : null"/>
                </div>
              </template>
              <div style="text-align:center;"><b><u>{{badge.label}}</u></b></div>
              <div style="text-align:center;">{{badge.description}}</div>
            </v-tooltip>
          </v-btn-toggle>
      </div>

      <div class="review-spacing"><v-textarea style="width:400px;" width v-model="reviewContent" label="comments" filled/></div>

      <div style="margin-bottom:-20px;">
      <v-btn v-if="!this.edit" @click="submitReview"> SUBMIT </v-btn> 
      <v-btn v-else @click="submitEdit"> SUBMIT </v-btn> 
      </div>
      
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
      // badgeReacts : [], 
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
      //let badgeFilters = this.affirmedBadges.map((idx) => this.badges[idx].label);
      this.affirmedBadges.map((idx) => this.badges[idx].label).forEach((badge) => {
        axios.post(`/api/badge/affirm`, {
          badgeId: badge
        })
        .then(() => {
          console.log("Affirm successful");
        })
        .catch((error) => {
          eventBus.$emit("error-message", error.response.error + + "oh no 2");
        })
      })
    },

    denyBadges: function() {
      //let badgeFilters = this.deniedBadges.map((idx) => this.badges[idx].label);
      this.deniedBadges.map((idx) => this.badges[idx].label).forEach((badge) => {
        axios.post(`/api/badge/deny`, {
          badgeId: badge
        })
        .then(() => {
          console.log("Deny successful");
        })
        .catch((error) => {
          eventBus.$emit("error-message", error.response.error + "oh no 1");
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
  margin-top: 10px; 
}

.smaller-width{
  width: 70%; 
  text-align: center;
}

</style>
<template>
  <Overlay>
    <v-card class = "review" >

      <div class="secondary-header"> {{this.$route.params.business.name}} </div>

      <div class="quarternary-header"> How would you rate your overall experience in terms of COVID-19 safety? </div>

      <v-rating
        v-model="rating"
        background-color="indigo lighten-3"
        color="indigo"
        large
      ></v-rating>
     
      <div>
        <center> Affirm Badges </center>
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

      <div>
        <center> Deny Badges </center>
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
      reviewContent : "",
      userId: "",
    }
  },
  components : {
    Overlay 
  },
  created() {
    this.loadBadges();
    this.getUserId();
  },

  methods : {
    
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


    getUserId: function() {
      axios.get(`/api/user/${this.$state.username}/search`)
      .then((response) => {
        this.userId = response.data.id;
      })
      .catch((error) => {
        window.console.log(error.response);
      })
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
        axios.post(`api/badge/affirm`, {
          userId: this.userId,
          badgeId: badge.id
        })
        .then(() => {
          console.log("Affirm successful");
        })
        .catch((error) => {
          console.log(error.response);
        })
      })
    },

    denyBadges: function() {
      this.badges.filter((badge) => badge.denied).forEach((badge) => {
        axios.post(`api/badge/deny`, {
          userId: this.userId,
          badgeId: badge.id
        })
        .then(() => {
          console.log("Deny successful");
        })
        .catch((error) => {
          console.log(error.response);
        })
      })
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
        this.affirmBadges();
        this.denyBadges();
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

.v-chip.affirmed {
  background: rgb(73, 214, 73);
}

.v-chip.denied {
  background: rgb(240, 19, 19);
}

</style>
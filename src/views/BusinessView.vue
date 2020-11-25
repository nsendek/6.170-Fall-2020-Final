<template >
	<div class = "main">
    <div :class="'left-container'">
      <v-card  v-if="business" style = "padding: 50px; display:flex; flex-direction:column; align-items:center;">
        <div class = "secondary-header"> <b>{{business.name}}</b> </div>
        <div class = "quarternary-header"> {{business.address}} </div>
        <div style="text-align:center;">
          <v-chip style="margin: 5px;" :key="idx" v-for="(badge,idx) in badges">
            {{badge.label}}
          </v-chip>
        </div>
      </v-card>
    </div>

    <div :class="'right-container'">
      <div class = "primary-header" style="text-align: center;"> REVIEWS </div>
      <Feed>
        <v-card style="padding:25px; margin-bottom: 10px;" :key="idx" v-for="(review,idx) in reviews">
          <div class="flex-row" style="display:flex; flex-direction:row; align-items:center; ">
            <span class = "tertiary-header" > <b>@{{review.author.username}}</b> </span>
            <v-rating class = "review-rating" style="display:inline;" readonly size="24" :value="review.rating"></v-rating>
          </div>
          <div> {{review.content}} </div>
        </v-card>
      </Feed>
    </div>

	</div>
</template>
<script>
import axios from "axios";
// import { eventBus } from "../main.js"
import Feed from "../components/Feed.vue"

export default {
	name: "BusinessView",
	components : {
    Feed
	},
	data () {
		return {
      reviews : [],
      badges : [],
			business : null
		}
  },
  created : async function () {
    if (await this.loadBusiness()) {
      await this.loadBadges();
      await this.loadReviews();  
    }
  },
	methods : {
    async loadBusiness() {
      this.business = null;
      let response = await axios.get(`/api/business/${this.$route.params.id}`)
        .catch(err => err.response);
          
      if (response.status == 200) {
        this.business = response.data;
      } else { // user doesn't exist 
        this.$router.push({name : "notfound"});
        return false;
      }
      return true;
    },
		async loadReviews() {
      this.reviews = [];
      let response = await axios.get(`/api/business/${this.$route.params.id}/reviews`)
          .catch(err => err.response);
      
      if (response.status == 200) {
        this.reviews = response.data;
      }
    },
    async loadBadges() {
      this.badges = [];
      let response = await axios.get(`/api/business/${this.$route.params.id}/badges`)
          .catch(err => err.response);
      
      if (response.status == 200) {
        this.badges = response.data;
      }
    },
	},
}
</script>
<style>
.review-rating .v-icon {
  padding : 3px !important;
}
.main {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  /* color: white; */
  height : 100%;
}

.left-container {
  width: 40%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 0px 20px;
  align-items: center;
  justify-content: center;
  /* justify-content: flex-end; */
}

.right-container {
  width: 60%;
  padding: 0px 20px;
  height: 100vh;
  overflow-y: scroll;
}

.primary-header {
  font-size: 2.5em;
  text-align: center;
  margin: 20px;
}

.secondary-header {
  font-size: 2em;
  text-align: center;
}

.tertiary-header {
  font-size: 1.5em;
  text-align: center;
}

.quaternary-header {
  font-size: 1em;
  text-align: center;
}
</style>
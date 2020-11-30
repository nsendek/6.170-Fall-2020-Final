<template >
    <div class = "main">
      
      <div class = "business-col">
        <v-btn style="width:33%;" @click="openReview"> Submit Review </v-btn>
        <v-card  v-if="business" style = "padding: 50px; display:flex; flex-direction:column; align-items:center;">
          <div class = "secondary-header"> <b>{{business.name}}</b> </div>
          <div class = "quarternary-header"> {{business.address}} </div>
          <div class = "quarternary-header"> Rating: {{rating}} </div>
          <div style="text-align:center;">
            <v-chip style="margin: 5px;" :key="idx" v-for="(badge,idx) in badges">
              {{badge.label}}
            </v-chip>
          </div>
        </v-card>
      </div>

      <div >
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
import { eventBus } from "../main.js"
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
      business : null,
      rating: 0,
		}
  },
  created : async function () {
    if (await this.loadBusiness()) {
       this.loadBadges();
       this.loadReviews();  
       this.loadRating();
       eventBus.$emit("businesses", [this.business]);
    }
    eventBus.$emit("clicked", this.business); 
  },
	methods : {
    openReview() {
      this.$router.push({ name: 'review', params: { business: this.business }})
    },

    async loadRating() {
      axios.get(`/api/business/${this.business.id}/rating`)
      .then((response) => {
        this.rating = response.data.avg;
      })
      .catch((error) => {
        window.console.log(error.response);
      })
    },

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
      let response = await axios.get(`/api/business/${this.$route.params.id}/reviews`)
          .catch(err => err.response);
      this.reviews = (response.status == 200) ? response.data : [];
    },
    async loadBadges() {
      let response = await axios.get(`/api/business/${this.$route.params.id}/badges`)
          .catch(err => err.response);
      this.badges =  (response.status == 200) ? response.data : [];
    },
	},
}
</script>
<style scoped>
.review-rating .v-icon {
  padding : 3px !important;
}
.main {
  display: flex;
  flex-direction: column;
  align-items: center;
  width : 100%;
}

.business-col {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.business-col > .v-btn {
  margin: 10px;
}
</style>
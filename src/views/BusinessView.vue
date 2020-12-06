<template >

  <v-container>
    <div class = "business-col">
      <v-btn v-if="this.$state.username && !this.$state.isBusiness" style="width:33%;" @click="openReview"> Submit Review </v-btn>
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

    <div class = "primary-header" style="text-align: center;"> REVIEWS </div>
    <Feed>
      <v-card class = "review-card" :key="idx" v-for="(review,idx) in reviews">
        <div class="flex-row" style="display:flex; flex-direction:row; align-items:center; ">
          <span class = "tertiary-header" > <b>@{{review.author.username}}</b> </span>
          <v-rating class = "review-rating" style="display:inline;" readonly size="24" :value="review.rating"></v-rating>
        </div>
        <div> {{review.content}} </div>
        <div> <b> {{timeFormat(review.timestamp)}} </b> </div>
      </v-card>
    </Feed>

    <v-pagination v-model="page" :length="totalPages" :total-visible="7" @input="next"></v-pagination>

  </v-container>
</template>
<script>
import axios from "axios";
import { eventBus } from "../main.js"

const timeFormat = (timestamp) => {
  let created = new Date(timestamp * 1000);
  let diff = (new Date()) - created; // milliseconds
  if (diff > 3.154e+10) {
    let month = created.toLocaleString('default', { month: 'short'});
    let year = created.getFullYear();
    return `${month} ${created.getDate()}, ${year}`;
  } else if (diff > 8.64e+7) {
    let month = created.toLocaleString('default', { month: 'short' });
    return `${month} ${created.getDate()}`;
  } else {
    let hour =  diff / 3.6e+6;
    return (hour < 1)
      ? (60*hour < 1) 
        ? "Now"
        : `${Math.round(60*hour)}m`
      : `${Math.round(hour)}h`
  }
}

export default {
  name: "BusinessView",
  
	components : {
    Feed : () => import("../components/Feed.vue")
  },
  
	data () {
		return {
      timeFormat,
      reviews : [],
      badges : [],
      business : null,
      rating: 0,
      page : 1,
      totalPages: 1
		}
  },

  created : async function () {
    if (await this.loadBusiness()) {
       this.loadBadges();
       this.loadReviews();  
       this.loadRating();
       eventBus.$emit("businesses", [this.business]);
    }
    eventBus.$emit("clicked", this.business, true); 
  },

  updated(){
    eventBus.$on(("review-posted"), () => {
      this.loadBadges();
      this.loadReviews();  
      this.loadRating();
    });
    eventBus.$on(("edit-badge-success"), () => {
      this.loadBadges();
    });
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
      let response = await axios.get(`/api/business/${this.$route.params.id}/reviews`, { params: { page: this.page } })
          .catch(err => err.response);
          
      if(response.status == 200){
        this.reviews = response.data.results; 
        window.console.log(this.reviews); 
        this.totalPages = response.data.totalPages; 
      }
      else{
        this.reviews = []; 
      }
    },

    async loadBadges() {
      let response = await axios.get(`/api/business/${this.$route.params.id}/badges`)
          .catch(err => err.response);
      this.badges =  (response.status == 200) ? response.data : [];
    },

    next: function(){
      this.loadReviews(); 
    }
	},
}
</script>
<style scoped>
.review-rating .v-icon {
  padding : 3px !important;
}

.business-col {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.business-col > .v-btn {
  margin: 10px;
}

.review-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 5px 25px; 
  margin: 5px 0px;
}
</style>
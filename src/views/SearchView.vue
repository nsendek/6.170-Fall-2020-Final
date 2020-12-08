<template>
  <div>
    <div class = "secondary-header" style="margin-bottom: 25px;"> 
      Search results for "<i>{{$route.query.search}}</i>"
    </div>
    <Feed dataType="Businesses">
        <BusinessFeedItem
          v-for="(business,idx) in businesses"
          :key="business.id"
          :business="business"
          :idx="idx"
        >
        </BusinessFeedItem>
    </Feed>
	</div>
</template>
<script>
import axios from "axios";
import { eventBus } from "../main.js";

export default {
  name: "SearchView",
  components : {
      BusinessFeedItem : () => import("../components/BusinessFeedItem.vue"), 
      Feed : () => import("../components/Feed.vue")
  },
  data() {
    return {
      businesses : [],
      query : ""
    }
  },
  created() {
    this.loadData();
  },
  methods : {
    async loadData() {
      this.query = this.$route.query.search;
      let response = await axios.get(`/api/search?search=${this.query}`)
        .catch(err => err.response);

      if (response.status == 200) {
        this.businesses = response.data.businesses;
        eventBus.$emit("businesses", response.data.businesses);
      } else {
        eventBus.$emit("error-message", response.data.error ? response.data.error : response.data);
      }
    },
  },
  watch: {
    '$route' (to) {
      if (to.query.search != this.query) {
        this.loadData();
      }
    }
  }
}
</script>
<style scoped>
</style>
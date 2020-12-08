<template>
<v-container>

    <h1 >Businesses</h1>
    <div>
        Filter By Safety Policy: 
        <div class="pa-4">
          <v-btn-toggle
           v-model="selectedBadges"
            @change="applyFilter"
            active-class="primary--text"
            center
            multiple>
            <v-tooltip 
              max-width="200px" top 
              v-for='(badge,index) in allBadges' v-bind:key="index"
              open-delay="1000"
            >
              <template v-slot:activator="{ on }">
                <!-- v chip also works here -->
                <v-btn
                text
                depressed
                v-on="on"
                 filter > 
                <BadgeIcon :badgeLabel=badge.label :height=50 />
                <!-- <img class="mr-3" 
                  :src="require('../assets/icons/masks_required.png')"
                   height="40"/> -->
                    <!-- {{badge.label}} -->
                </v-btn>
              </template>
              <div style="text-align:center;">{{badge.description}}</div>
            </v-tooltip>
          </v-btn-toggle>
        </div>

        <v-btn v-on:click= "resetFilter" type="button">Reset Filters</v-btn>
    </div>


    <Feed dataType="Businesses">
        <BusinessFeedItem
            v-for="(business,idx) in businesses"
            v-bind:key="business.id"
            v-bind:business="business"
            v-bind:idx="idx"
        >
        </BusinessFeedItem>
    </Feed>

    <v-pagination v-model="page" :length="totalPages" :total-visible="7" @input="next"></v-pagination>
</v-container>
</template>


<script>
import axios from "axios";
import qs from "qs"; 
import { eventBus } from "../main";
export default {
    name: "BusinessFeed",
    components: {
      BusinessFeedItem : () => import("./BusinessFeedItem"), 
      Feed : () => import("../components/Feed.vue"),
      BadgeIcon: () => import("./BadgeIcon"),
    },
    data() {
        return {
            error:"",
            success:"",
            businesses: [],
            allBadges: [],
            selectedBadges : [],
            page : 1, 
            totalPages: 1,
            userBadges : [],
            businessBadges : {}
        }
    },

    created: function() {
      eventBus.$on(("signin-success"), () => {
        this.loadUserBadges();
      });

      eventBus.$on("edit-prefs-success", () => {
        this.loadUserBadges();
      });

      eventBus.$on(("signout-success"), () => {
        this.userBadges = [];
      })
    },

    mounted: function() {
        //needs to go before loadBusinesses, becuase it's what businesses will sort by
        this.loadUserBadges();
        this.loadBusinesses();
        this.loadBadges();
    },


    methods: {
      applyFilter() { 
        if (this.selectedBadges.length > 0) {
          this.filterBusinessesByBadges();
        } else {
          this.loadBusinesses();
        }
      },
      resetFilter() {
        this.selectedBadges = [];
        this.loadBusinesses();
      },
      // Loads all businesses
      loadBusinesses: function() {
        // added a paramsSerializer so that it can interpret an array as a parameter
        axios.get("/api/business", { params: { page: this.page, userBadges : this.userBadges }, paramsSerializer: params => {
          return qs.stringify(params)
        } })
        .then(async (res) => {
            // .forEach doesn't await between iterations
            for (let index = 0; index < res.data.results.length; index++) {
              let b = res.data.results[index];
              let badges = await this.getBusinessBadges(b);
              this.businessBadges[b.id] = badges;
            }
            // sort function can't be async so you have to laod all badges beforehand
            
            
            // this.businesses = res.data.results.sort(this.sortBusinesses);
            this.businesses = res.data.results; 
            
            
            // this.businesses = res.data.results ? res.data.results : [];
            this.totalPages = res.data.totalPages; 
            eventBus.$emit('businesses', res.data.results)
        })
      },

      next: function() { 
          let badgeFilters = this.selectedBadges.map((idx) => this.allBadges[idx].label);

          if(badgeFilters.length > 0){
              this.filterBusinessesByBadges(true); 
          }
          else{
              this.loadBusinesses();
          }
      }, 

      // Loads all badge types
      loadBadges: function() {
          axios.get("/api/badge")
          .then((res) => {
              this.allBadges = res.data ? res.data : [];
          })
      },

      // #TODO Loads all userBadges
      loadUserBadges: function() {
        // this.userBadges = ["MASKS REQUIRED"]
        axios.get("/api/user/rank")
        .then((response) => {
          console.log("res dat:", response);
          this.userBadges = response.data.map((badge) => badge.label) ? response.data : [];
        })
        .catch((error) => {
          console.log(error.response);
        })
      },

      // Filters businesses by one or more badges
      filterBusinessesByBadges: function(nextPage = false) {
          if(nextPage !== true) {
              window.console.log("i am resetting the page"); 
              this.page = 1; 
          }

          let badgeFilters = this.selectedBadges.map((idx) => this.allBadges[idx].label);

          if (badgeFilters.length === 0) {
              eventBus.$emit('error-message',"Please choose one or more badges to filter by");
          } else {

          window.console.log(badgeFilters); 
          axios.get(`api/badge/filter`, {params : {badges : badgeFilters, page: this.page}})
          .then((res) => {
              this.businesses = res.data.results ? res.data.results : [];
              this.totalPages = res.data.totalPages; 
              eventBus.$emit('businesses', res.data.results)
          })
          .catch((err) => {
              eventBus.$emit('error-message', err);
          })
          }
      },

        
        async getBusinessBadges(business) {
          return axios.get(`/api/business/${business.id}/badges`)
              .then((res) => {
                const badges = res.data ? res.data.map(badge => badge.label) : [];
                return badges;
              }).catch(err =>{
                console.log(err);
                return [];
              })
          },


      //sort 2 business items based on user badges, ordered by ranking. Most important badge first
       sortBusinesses(a, b){
        let aBadges = this.businessBadges[a.id];
        let bBadges = this.businessBadges[b.id];

        // console.log("going in", a,b)
        // console.log("coming out", aBadges,bBadges)
        // forEach does not return the surrounding function
        for (let idx = 0; idx < this.userBadges.length; idx++) {
          let badge = this.userBadges[idx]  
          if (!aBadges.includes(badge) && bBadges.includes(badge)) return 1;
          if (aBadges.includes(badge) && !bBadges.includes(badge)) return -1;
        }
        return 0;
      },
    }
    
}
</script>
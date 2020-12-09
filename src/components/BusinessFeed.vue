<template>
<v-container class="no-scroll pa-4">

    <h1 >Businesses</h1>
    <div class="filter-div">
        <div class="small-help-text">Filter By Safety Policy : </div>
        <div>
          <v-btn-toggle
            class="badges-container"
            v-model="selectedBadges"
            @change="applyFilter"
            center
            background-color="button-group"
            borderless
            multiple
            >
            <v-tooltip 
              max-width="200px" top 
              v-for='(badge,index) in allBadges' v-bind:key="index"
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

        <div class="reset-button">
        <v-btn v-on:click= "resetFilter" type="button">Reset Filters</v-btn>
        </div>
    </div>


    <Feed :key="businesses" dataType="Businesses">
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

function arraysEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;
  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}
export default {
    name: "BusinessFeed",
    components: {
      BusinessFeedItem : () => import("./BusinessFeedItem"), 
      Feed : () => import("../components/Feed.vue"),
      BadgeIcon: () => import("./BadgeIconAlt"),
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
            prevUserBadges : [],
            businessBadges : {}
        }
    },

    watch:{
      async '$route' (to, from) {
        if (to.name == "main" && to.name != from.name) {
          await this.loadUserBadges();
          if (!arraysEqual(this.userBadges, this.prevUserBadges)) {
            this.loadBusinesses();
          }
        }
     }
    },

    created: function() {
      eventBus.$on(("signin-success"), async () => {
        await this.loadUserBadges();
        this.loadBusinesses();
      });

      eventBus.$on(("signout-success"), () => {
        this.userBadges = [];
      })
    },

    mounted: async function() {
        this.loadBadges();
        await this.loadUserBadges(); // wait until this function finishes
        this.loadBusinesses();
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
        this.businesses = [];
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
      loadUserBadges: async function() {
        this.prevUserBadges = this.userBadges;
        await axios.get("/api/user/rank") 
          .then((response) => {
            let sortedBadges = response.data.sort((a,b) => a.value - b.value);
            console.log("user ranks:", sortedBadges);
            this.userBadges = sortedBadges.map((badge) => badge.label);
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

<style>
  .v-btn-toggle {
    /* border-radius: 100px; */
    margin: 10px 0px; 
    width: 100%; 
    height: 100%; 
    overflow: scroll;
  }

  .small-help-text{
    padding-top: 12px; 
    margin-left: 12px; 
    margin-bottom: -10px; 
    opacity: 50%; 
  }

  .filter-div{
    background: var(--v-button-group-base); 
    border-radius: 5px; 
    /* background : #button-group;  */
  }

  .reset-button{
    display: flex; 
    width: 97%;
    justify-content: flex-end;
    padding-bottom: 10px; 
  }


</style>
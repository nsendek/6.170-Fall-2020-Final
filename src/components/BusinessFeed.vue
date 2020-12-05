<template>
<v-container>
    <h1 >Businesses</h1>
    <div>
        Filter By Badge: 
        <div class="pa-4">
          <v-chip-group v-model="selectedBadges" @change="applyFilter" column active-class="primary--text" multiple>
            <v-tooltip 
              max-width="200px" top 
              v-for='(badge,index) in allBadges' v-bind:key="index"
              open-delay="1000"
            >
              <template v-slot:activator="{ on }">
                <v-chip v-on="on" filter >
                    {{badge.label}}
                </v-chip>
              </template>
              <div style="text-align:center;">{{badge.description}}</div>
            </v-tooltip>
          </v-chip-group>
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
import { eventBus } from "../main";
export default {
    name: "BusinessFeed",
    components: {
      BusinessFeedItem : () => import("./BusinessFeedItem"), 
      Feed : () => import("../components/Feed.vue")
    },
    data() {
        return {
            error:"",
            success:"",
            businesses: [],
            allBadges: [],
            selectedBadges : [],
            page : 1, 
            totalPages: 1
        }
    },

    mounted: function() {
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
      
        axios.get("/api/business", { params: { page: this.page } })
        .then((res) => {
            this.businesses = res.data.results ? res.data.results : [];
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
      }
    }
    
}
</script>
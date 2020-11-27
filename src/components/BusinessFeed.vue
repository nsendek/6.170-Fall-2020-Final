<template>
<div>
    <h1>Businesses</h1>
    <div class= "filter-bar">
        Filter By: 
       <div v-for='(badge,index) in allBadges' v-bind:key="badge.id">
            <input type="checkbox" v-bind:id="index" v-model="allBadges[index].checked" value="badge" v-on:click="toggleCheck(index)" >
            <label for="badge"> {{badge.label}} </label>
       </div>

        <v-btn v-on:click= "filterBusinessesByBadges" type="button" >Apply Filters</v-btn>
        <v-btn v-on:click= "loadBusinesses" type="button" >Reset Filters</v-btn>

    </div>


    <Feed dataType="Businesses">
        <BusinessFeedItem
            v-for="business in businesses"
            v-bind:key="business.id"
            v-bind:business="business"
        />
    </Feed>
</div>
</template>


<script>
import axios from "axios";
import { eventBus } from "../main";
import BusinessFeedItem from "./BusinessFeedItem";
import Feed from "./Feed"
export default {
    name: "BusinessFeed",
    components: {BusinessFeedItem, Feed},
    data() {
        return {
            error:"",
            success:"",
            businesses: [],
            allBadges: [],
        }

    },

    mounted: function() {
        this.loadBusinesses();
        this.loadBadges();
    },


    methods: {
        // Loads all businesses
        loadBusinesses: function() {
          for (var idx = 0; idx < this.allBadges.length; idx++) 
            this.allBadges[idx].checked = false; 
        
          axios.get("/api/business")
          .then((res) => {
              this.businesses = res.data ? res.data : [];
              eventBus.$emit('businesses', res.data)
          })
        },
        // Loads all badge types
        loadBadges: function() {
            axios.get("/api/badge")
            .then((res) => {
                // res = list of {id: , label: } badge objects
                this.allBadges = res.data ? res.data : [];
                this.allBadges.forEach((badgeObject) => badgeObject.checked = false)
            })
        },

        // Filters businesses by one or more badges
        filterBusinessesByBadges: function() {
            let badgeFilters = this.allBadges.filter((badgeObject) => badgeObject.checked)
                                            .map((badgeObject) => badgeObject.label);
            if (badgeFilters.length === 0) {
                eventBus.$emit('error-message',"Please choose one or more badges to filter by");
            } else {

            axios.get(`api/badge/filter`, {params : {badges : badgeFilters}})
            .then((res) => {
                this.businesses = res.data;
                eventBus.$emit('businesses', res.data)
            })
            .catch((err) => {
                eventBus.$emit('error-message', err);
            })
            }
        },

        toggleCheck: function(itemId) {
          if (this.allBadges[itemId].checked) {
            this.allBadges[itemId].checked = false;
          } else {
            this.allBadges[itemId].checked = true;

          }
        },
    }
    
}
</script>
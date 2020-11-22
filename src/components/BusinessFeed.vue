<template>

<div>
    <h1>Businesses</h1>
    <div v-if='success' class="success-message">
        {{ success }}
    </div>

    <div v-if='error' class="error-message">
        {{ error }}
    </div>

    <div class= "filter-bar">
        Filter By: 
       <div v-for='(badge,index) in allBadges' v-bind:key="badge.id">
            <input type="checkbox" v-bind:id="index" value="badge" v-on:click="toggleCheck(index)" >
            <label for="badge"> {{badge.label}} </label>
       </div>

        <button v-on:click= "filterBusinessesByBadges" type="button" onclick>Apply Filters</button>
        <button v-on:click= "loadBusinesses" type="button" onclick>Reset Filters</button>

    </div>


    <div v-if='businesses.length'>
        <BusinessFeedItem
            v-for="business in businesses"
            v-bind:key="business.id"
            v-bind:business="business"
        />
    </div>
</div>
    
</template>


<script>
import axios from "axios";
// import { eventBus } from "../main";
import BusinessFeedItem from "./BusinessFeedItem";
export default {
    name: "BusinessFeed",
    components: {BusinessFeedItem},
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
            axios.get("/api/business")
            .then((res) => {
                this.businesses = res.data ? res.data : [];
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
                this.error = "Please choose one or more badges to filter by";
                this.resetErrorMessage();
            } else {

            axios.get(`api/badge/filter`, {params : {badges : badgeFilters}})
            .then((res) => {
                this.businesses = res.data;
            })
            .catch((err) => {
                this.error = err;
                this.resetErrorMessage();
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

        resetErrorMessage: function() {
            setInterval(() => {
                this.error = "";
            }, 3000)
        }



    }
    
}
</script>
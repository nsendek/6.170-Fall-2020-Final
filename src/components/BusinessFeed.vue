<template>

<div class="business-pane">
    <h1>Businesses</h1>
    <div v-if='success' class="success-message">
        {{ success }}
    </div>

    <div v-if='error' class="error-message">
        {{ error }}
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
            businesses: []
        }
    },

    mounted: function() {
        this.loadBusinesses();
    },


    methods: {
        loadBusinesses: function() {
            axios.get("/api/business")
            .then((res) => {
                this.businesses = res.data ? res.data : []
            })
        }



    }
    
}
</script>
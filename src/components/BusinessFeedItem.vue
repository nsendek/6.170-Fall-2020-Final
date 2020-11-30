<template>

<v-card style="padding:25px; margin: 5px 10px;">
  <div> <h2 class="business-count">{{1+idx}}</h2> </div>
  <router-link :to="`/business/${business.id}`">
    <h3>{{business.name}}</h3>
  </router-link>
  <div> <i>Address: {{business.address}}</i> </div>

   <v-chip small style="margin: 2.5px;" :key="idx" v-for="(badge,idx) in badges">
    {{badge}}
  </v-chip>

</v-card>

</template>


<script>
import axios from "axios";
// import {eventBus} from "../main"

export default {
    name: "BusinessItem",
    props: {
        business: Object,
        idx : Number
    },
    data() {
        return {
            badges: [],
        }
    },

    mounted: function() {
        this.getBusinessBadges();
    },

    methods: {
        getBusinessBadges: function() {
            axios.get(`/api/business/${this.business.id}/badges`)
            .then((res) => {
                this.badges = res.data ? res.data.map(badge => badge.label) : [];
            })
        }
    }


}
</script>
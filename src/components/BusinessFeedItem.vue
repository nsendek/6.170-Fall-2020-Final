<template>

<v-card style="padding:25px; margin: 5px 10px;">
  <div> <h2 class="business-count">{{1+idx}}</h2> </div>
  <router-link :to="`/business/${business.id}`">
    <h3>{{business.name}}</h3>
  </router-link>
  <div> <i>Address: {{business.address}}</i> </div>

   <v-chip
    small style="margin: 2.5px;"
     :key="idx"
      v-for="(badge,idx) in badges"
      :class="getBadgeTier(badge)">
    {{badge.label}}
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
                this.badges = res.data ? res.data : [];
                this.badges.forEach((badge) => this.getBadgeRatio(badge));
            })
        },

        getBadgeRatio: function(badge) {
            axios.get(`/api/badge/${badge.id}/ratio`)
            .then((response) => {
                this.$set(badge, 'ratio', response.data.ratio);
                this.$set(badge, 'affirms', response.data.affirms);
                this.$set(badge, 'denies', response.data.denies);
            })
            .catch((error) => {
                console.log(error.response);
                this.$set(badge, 'ratio', "Not available");
                this.$set(badge, 'affirms', "Not available");
                this.$set(badge, 'denies', "Not available");
            });
        },

        getBadgeTier(badge) {
            if (badge.ratio > 80 && (badge.affirms + badge.denies >= 10)) {
                return "gold";
            } else if (badge.ratio > 50) {
                return "silver";
            } else {
                return "bronze";
            }
        }
    }


}
</script>

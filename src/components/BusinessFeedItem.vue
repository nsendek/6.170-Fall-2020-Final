<template>

<v-card style="padding:20px; margin: 10px 0px;">
  <div> <h2 class="business-count">{{1+idx}}</h2> </div>

  <div class="business-name"><router-link :to="`/business/${business.id}`" class="business-name">
    <h3>{{business.name}}</h3>
  </router-link></div>
  <div class="some-space"> <i>{{business.address}}</i> </div>

  <div class="badges-container" style="justify-content: left;">
    <div :key="idx" v-for="(badge,idx) in badges" style="margin: 2.5px 5px;"> 
    <BadgeIcon :color="getBadgeTier(badge)" :badgeLabel="badge.label" :size="35" :border="8" />
    {{badge.ratio === null ? "N/A" : `${badge.ratio}%`}}
    </div>
  </div>


  </v-card>
</template>


<script>
import axios from "axios";
// import {eventBus} from "../main"

export default {
    name: "BusinessItem",
    components: {
        BadgeIcon: () => import("./BadgeIconAlt"),
    },
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

<style scoped>
.business-name{
    color: var(--v-accent-base); 
    text-decoration: none;
    font-size: 20px; 
}

.some-space{
    margin: 3px; 
    margin-bottom: 10px;
}
</style>

<template>
  <v-card 
    color="info-window"
    v-if="business"
    :dark="this.$vuetify.theme.dark" 
    :light="!this.$vuetify.theme.dark"  
    style = "padding: 5px; display:flex; flex-direction:column; align-items:center;">
    <div class = "secondary-header"> 
       <router-link color="primary" :to="`/business/${business.id}`" >
        <b> {{business.name}} </b>
      </router-link> 
    </div>
    <div class = "quarternary-header">
      {{business.address}}
    </div>
    <div class="badges-container" style="justify-content: center;">
    <div :key="idx" v-for="(badge,idx) in badges" style="margin: 2.5px 5px;"> 
    <BadgeIcon :color="getBadgeTier(badge)" :badgeLabel="badge.label" :size="28" :border="7" />
        <!--if we want % {{isNaN(badge.ratio) ? null : `${Math.round(badge.ratio)}%`}} -->
    </div>
  </div>
  </v-card>
</template>
<script>
import axios from "axios";

export default {
  components: {
        BadgeIcon: () => import("./BadgeIconAlt"),
    },
  props : {
    business : {
      type : Object,
      default : () => {}
    },
  },
  data() {
    return {
      badges : []
    }
  },
  created() {
    axios.get(`/api/business/${this.business.id}/badges`).then( res => {
        this.badges = res.data ? res.data : [];
        this.badges.forEach((badge) => this.getBadgeRatio(badge));
    })
  },
  methods: {
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
            })
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
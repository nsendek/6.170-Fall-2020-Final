<template>
    <Overlay>
        <v-card class="overlay-card">
          <BusinessProfile v-if="this.businessProfile"/>
          <BusinessAccountInfo v-else-if="this.businessAccount"/>
        </v-card>
    </Overlay>
</template>

<script>
import { eventBus } from "../main";
export default {
  name : "UserProfileVue",
  components : {
    BusinessProfile : () => import('../components/BusinessProfile.vue'),
    BusinessAccountInfo : () => import('../components/BusinessAccountInfo.vue'),
    Overlay : () => import('../components/Overlay.vue')
  }, 

  data : function(){
    return { 
      businessProfile : true, 
      businessAccount : false, 
    }
  },

  methods : {    
    clearPage : function(){
      this.businessProfile = false; 
      this.businessAccount = false; 
    },

    showBusinessProfile() {
      this.clearPage(); 
      this.businessProfile = true;
    },

    showBusinessAccount() {
      this.clearPage(); 
      this.businessAccount = true;
    },

  },
  created : function(){
    eventBus.$on("show-business-profile", this.showBusinessProfile);
    eventBus.$on("show-business-account", this.showBusinessAccount);
  }, 
  beforeDestroy() {
    eventBus.$off("show-business-profile", this.showBusinessProfile);
    eventBus.$off("show-business-account", this.showBusinessAccount);
  }
}
</script>
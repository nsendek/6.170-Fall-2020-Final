<template>
  <Overlay>
    <v-card class="overlay-card">
      <UserProfile v-if="this.userProfile"/>
      <UserAccount v-else-if="this.userAccount"/>
    </v-card>
  </Overlay>
</template>

<script>
import { eventBus } from "../main";
export default {
  name : "UserProfileVue",
  components : {
    UserProfile : () => import('../components/UserProfile.vue'), 
    UserAccount : () => import('../components/UserAccount.vue'), 
    Overlay : () => import('../components/Overlay.vue')
  }, 

  data : function(){
    return { 
      userProfile : true, 
      userAccount : false, 
    }
  },

  methods : {    
    clearPage : function(){
      this.userProfile = false; 
      this.userAccount = false; 
    },

    showUserProfile() {
      this.clearPage(); 
      this.userProfile = true;
    },

    showUserAccount() {
      this.clearPage(); 
      this.userAccount = true;
    },

  },
  created : function(){
    eventBus.$on("show-user-profile", this.showUserProfile);
    eventBus.$on("show-user-account", this.showUserAccount);
  }, 
  beforeDestroy() {
    eventBus.$off("show-user-profile", this.showUserProfile);
    eventBus.$off("show-user-account", this.showUserAccount);
  }
}
</script>
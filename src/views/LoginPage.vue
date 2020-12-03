<template>
  <Overlay>
    <v-card class="login-card">
      <UserLogin v-if="userLogin"/>
      <UserCreateAccount v-else-if="userCreateAccount" />
      <BusinessCreateAccount v-else-if="businessCreateAccount" />
    </v-card>
  </Overlay>
</template>

<script>
import { eventBus } from "../main";

export default {
  name : "LoginPage", 

  components : {
    UserLogin : () => import('../components/UserLogin.vue'),
    BusinessCreateAccount : () => import('../components/BusinessCreateAccount.vue'),
    UserCreateAccount : () => import('../components/UserCreateAccount.vue'), 
    Overlay: () => import('../components/Overlay.vue')
  }, 

  data : function(){
    return { 
      userLogin : true, 
      userCreateAccount : false, 
      businessCreateAccount : false
    }
  },
  methods : {    
    clearPage : function(){
      this.userLogin = false; 
      this.userCreateAccount = false; 
      this.businessCreateAccount = false; 
    },
    showUserLogin() {
      this.clearPage(); 
      this.userLogin = true;
    },
    showUserCreateAccount() {
      this.clearPage(); 
      this.userCreateAccount = true;
    },
    showBusinessCreateAccount() {
      this.clearPage(); 
      this.businessCreateAccount = true;
    }
  },
  created : function(){
    eventBus.$on("show-user-login", this.showUserLogin);
    eventBus.$on("show-user-create-account", this.showUserCreateAccount);
    eventBus.$on("show-business-create-account", this.showBusinessCreateAccount);
  }, 
  beforeDestroy() {
    eventBus.$off("show-user-login", this.showUserLogin);
    eventBus.$off("show-user-create-account", this.showUserCreateAccount);
    eventBus.$off("show-business-create-account", this.showBusinessCreateAccount);
  }
}
</script>


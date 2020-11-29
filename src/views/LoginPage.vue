<template>
  <Overlay>
    <UserLogin v-if="userLogin"/>
    <UserCreateAccount v-else-if="userCreateAccount" />
    <BusinessCreateAccount v-else-if="businessCreateAccount" />
  </Overlay>
</template>

<script>
import { eventBus } from "../main";

import UserCreateAccount from '../components/UserCreateAccount.vue'
import BusinessCreateAccount from '../components/BusinessCreateAccount.vue'
import UserLogin from '../components/UserLogin.vue'
import Overlay from '../components/Overlay.vue'

export default {
  name : "LoginPage", 

  components : {
    UserLogin,
    BusinessCreateAccount,
    UserCreateAccount, 
    Overlay
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


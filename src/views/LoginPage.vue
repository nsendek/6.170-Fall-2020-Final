<template>
  <div>
    <UserLogin v-if="userLogin"/>
    <UserCreateAccount v-else-if="userCreateAccount" />
    <BusinessCreateAccount v-else-if="businessCreateAccount" />
  </div>
</template>

<script>
import { eventBus } from "../main";

import UserCreateAccount from '../components/UserCreateAccount.vue'
import BusinessCreateAccount from '../components/BusinessCreateAccount.vue'
import UserLogin from '../components/UserLogin.vue'

export default {
  name : "LoginPage", 

  components : {
    UserLogin,
    BusinessCreateAccount,
    UserCreateAccount, 
  }, 

  data : function(){
    return { 
      userLogin : true, 
      userCreateAccount : false, 
      businessLogin : false, 
      businessCreateAccount : false
    }
  },

  created : function(){
    eventBus.$on("show-user-login", () => {
      this.clearPage(); 
      this.userLogin = true;
    });

    eventBus.$on("show-user-create-account", () => {
      this.clearPage(); 
      this.userCreateAccount = true;
    });

    eventBus.$on("show-business-login", () => {
      this.clearPage(); 
      this.businessLogin = true;
    });

    eventBus.$on("show-business-create-account", () => {
      this.clearPage(); 
      this.businessCreateAccount = true;
    });
  }, 

  methods : {
    clearPage : function(){
      this.userLogin = false; 
      this.userCreateAccount = false; 
      this.businessLogin = false;
      this.businessCreateAccount = false; 
    }
  }
}
</script>


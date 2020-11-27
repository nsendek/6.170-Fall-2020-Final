<template>
  <div class="login-container">
    <div class="big-title"> Login to Zelp </div>
    <div class="login-container">
      <div class="text-input"><v-text-field v-model="username" label="username" placeholder="username" filled/></div>
      <div class="text-input"><v-text-field v-model="password" label="password" placeholder="password" filled/></div>
      <div>
        <v-btn class="wide-button" v-if="isBusiness" v-on:click="BusinessLogin">Log In</v-btn>
        <v-btn class="wide-button" v-else v-on:click="UserLogin">Log In</v-btn>
         </div>
      <div class="bigger-margin"><div class="alt-option"><button v-on:click="goUserCreateAccount"> don't have an account? </button></div></div>
      <div>
        <input type="checkbox"  v-model="isBusiness">
        <label for="checkbox"> Signing in as a business? </label>
      </div>
    </div> 
  </div>
</template>

<script>
import axios from "axios";
import { eventBus } from "../main";

export default {
  name: "UserLogin",

  data: function(){
    return {
      username : "", 
      password : "",
      isBusiness: false,
    }
  }, 

  methods : {
    UserLogin : function(){
      axios.post("/api/user/signin", {
        username : this.username, 
        password : this.password
      })
      .then((response) => {
        eventBus.$emit("success-message", response.data.message);
        window.console.log("on logging in " + response.data.username); 
        this.$state.username = response.data.username; 
        this.$state.isBusiness = this.isBusiness;
        this.$router.push('/');
      })
      .catch((error) => { 
        eventBus.$emit("error-message", error.response.data.error); 
      });
    }, 

    goUserCreateAccount : function(){
      eventBus.$emit("show-user-create-account"); 
    }, 

    BusinessLogin : function(){
      axios.post("/api/business/signin", {
        username : this.username, 
        password : this.password
      })
      .then((response) => {
        eventBus.$emit("success-message", response.data.message);
        this.$state.username = response.data.username; 
        this.$state.isBusiness = this.isBusiness;
        this.$router.push('/');
      })
      .catch((error) => { 
        eventBus.$emit("error-message", error.response.data.error); 
      });    },

  }

}
</script>
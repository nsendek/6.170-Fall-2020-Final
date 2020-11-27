<template>
  <div class="login-container">
    <div class="big-title"> WELCOME TO ZELP </div>
    <div> 
        <p class="zelp-description">
        Zelp is a platform designed by students in the Cambridge community to keep users
        informed on local businesses and their practices in the Covid Era.

        Signing up for Zelp allows you to give feedback about the safety of local
         businesses, helping them stay accountable for standard COVID safety 
         regulations and informing other members of the Cambridge community.
        </p>  
    </div> 
    <div class="login-container">
      <div class="text-input"><v-text-field v-model="username" label="username" placeholder="username" filled /></div>
      <div class="text-input"><v-text-field v-model="password" label="password" placeholder="password" filled /></div>

      <div><v-btn v-on:click="createAccount" class="wide-button">Create Account</v-btn> </div>
      <div class="alt-option"><button v-on:click="goUserLogin"> already have an account? </button></div>
      <div class="smaller-margin alt-option" margin="0px"><button v-on:click="goBusinessCreateAccount"> are you a business? </button> </div>
    </div> 
  </div>
</template>

<script>
import axios from "axios";
import { eventBus } from "../main";

export default {
  name: "UserCreateAccount",

  data: function(){
    return {
      username : "", 
      password : ""
    }
  }, 

  methods : {
    createAccount : function(){
      axios.post("/api/user", {
        username : this.username, 
        password : this.password
      })
      .then((response) => {
        eventBus.$emit("success-message", response.data.message); 
        this.$state.username = response.data.user.username; 
        this.$state.isBusiness = false;
        this.$router.push('/');
      })
      .catch((error) => {
        eventBus.$emit("error-message", error.response.data.error); 
      });
    }, 

    // go to the user sign in page
    goUserLogin : function(){
      eventBus.$emit("show-user-login");
    }, 

    // go to the business create account page
    goBusinessCreateAccount : function(){
      eventBus.$emit("show-business-create-account"); 
    }
  }

}
</script>
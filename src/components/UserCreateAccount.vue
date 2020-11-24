<template>
  <div>
    <div> WELCOME TO ZELP </div>
    <div> description of Zelp </div> 
    <div>
      <div><input type="text" v-model="username" placeholder="account username" /></div>
      <div><input type="text" v-model="password" placeholder="password" /></div>

      <div><button v-on:click="createAccount">Create Account</button> </div>
      <div><button v-on:click="goUserLogin"> already have an account? </button></div>
      <div><button v-on:click="goBusinessCreateAccount"> are you a business? </button> </div>
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
      .then((response) => { // TODO change to "signin-success"?
        eventBus.$emit("success-message", response); 
      })
      .catch((error) => {
        eventBus.$emit("error-message", error); 
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
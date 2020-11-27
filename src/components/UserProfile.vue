<template>
  <div class="center-container">
    <div class="big-title">{{this.$state.username}} </div>

    <div class="row-container"> 
      <v-text-field v-model="username" placeholder="new username" dense filled/>
      <v-btn v-on:click="updateUsername">update username</v-btn>
    </div>

    <div class="row-container"> 
      <v-text-field v-model="password" placeholder="new password" dense filled/>
      <v-btn v-on:click="updatePassword">update password</v-btn>
    </div>

    <div><v-btn v-on:click="signout" class="wide-button"> SIGN OUT </v-btn></div>
    <div><v-btn v-on:click="deleteAccount" class="wide-button" color="red"> delete account </v-btn></div>
  </div>
</template>

<script>
import axios from "axios";
import { eventBus } from "../main";

export default {
  name : "UserProfile", 

  data: function(){
    return {
      username : "", 
      password : ""
    }
  }, 

  methods : {
    updateUsername : function(){
      axios.patch("/api/user", {
        username : this.username, 
      })
      .then((response) => {
        eventBus.$emit("success-message", "username successfully changed"); 
        this.$state.username = response.data.username;  
        this.username = ""; 
      })
      .catch((error) => { 
        eventBus.$emit("error-message", error.response.data.error); 
      });
    }, 

    updatePassword : function(){
      axios.patch("/api/user", {
        password : this.password
      })
      .then(() => {
        eventBus.$emit("success-message", "password successfully changed");
        this.password = ""; 
      })
      .catch((error) => { 
        eventBus.$emit("error-message", error.response.data.error); 
      });
    }, 

    signout : function(){
      axios.post("/api/user/signout")
      .then((response) => {
        eventBus.$emit("success-message", response.data.message);
        this.$state.username = ""; 
        this.$router.push('/');
      })
      .catch((error) => { 
        window.console.log(error.response); 
        eventBus.$emit("error-message", error.response.data.error); 
      });
    }, 

    deleteAccount : function() {
      axios.delete("/api/user/")
      .then((response) => {
        eventBus.$emit("success-message", "account successfully deleted");
        window.console.log(response.data); 
        this.$state.username = ""; 
        this.$router.push('/');
      })
      .catch((error) => { 
        window.console.log(error.response); 
        eventBus.$emit("error-message", error.response.data.error); 
      });
    }
  }
}
</script>
<template>
  <div>
    <div> LOG IN </div>
    <div>
      <div><input type="text" v-model="username" placeholder="username" /></div>
      <div><input type="text" v-model="password" placeholder="password" /></div>

      <div><button v-on:click="login">Log In</button> </div>
      <div><button v-on:click="goUserCreateAccount"> don't have an account? </button></div>
      <div><button v-on:click="goBusinessLogin"> are you a business? </button> </div>

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
      password : ""
    }
  }, 

  methods : {
    login : function(){
      axios.post("/api/user/signin", {
        username : this.username, 
        password : this.password
      })
      .then((response) => {
        eventBus.$emit("success-message", response.data.message);
        this.$state.username = response.data.username; 
        this.$state.isBusiness = response.data.isBusiness;
        this.$router.push('/');
      })
      .catch((error) => { 
        eventBus.$emit("error-message", error.response.data.error); 
      });
    }, 

    goUserCreateAccount : function(){
      eventBus.$emit("show-user-create-account"); 
    }, 

    goBusinessLogin : function(){
      eventBus.$emit("show-business-login"); 
    },

  }

}
</script>
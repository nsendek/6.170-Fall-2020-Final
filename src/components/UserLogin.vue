<template>
  <div>
    <div> LOG IN </div>
    <div>
      <div>
        <input type="checkbox"  v-model="isBusiness">
        <label for="checkbox"> Signing in as a business? </label>
      </div>
      <div><input type="text" v-model="username" placeholder="username" /></div>
      <div><input type="text" v-model="password" placeholder="password" /></div>
      <div>
        <button v-if="isBusiness" v-on:click="BusinessLogin">Log In</button>
        <button v-else v-on:click="UserLogin">Log In</button>
         </div>
      <div><button v-on:click="goUserCreateAccount"> don't have an account? </button></div>

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
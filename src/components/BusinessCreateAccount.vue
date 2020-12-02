<template>
  <div class="center-container">
    <div class="big-title">Welcome To Zelp</div>
        <p class="zelp-description">
        Zelp is a platform designed by students in the Cambridge community to keep users 
        informed on local businesses and their practices in the Covid Era.
        Signing your business up for Zelp helps keep the community informed on your 
        business’s safety precauations. The community gives feedback on the policies you 
        display here, and the better you do the safer your customers will feel!
        </p>
    <div class="center-container">
      <div class="text-input"><v-text-field v-model="name" label="business name" placeholder="business name" filled/></div>
      <div class="text-input"><v-text-field v-model="address" label="address" placeholder="address" filled/></div>
      <div class="text-input"><v-text-field v-model="accountName" label="account username" placeholder="account username" filled/></div>
      <div class="text-input"><v-text-field type="password" v-model="password" label="password" placeholder="password" filled/></div>

      <div><v-btn v-on:click="createAccount" class="wide-button">Create Account</v-btn></div>
      <div class="alt-option"><button v-on:click="goUserLogin"> already have an account? </button></div>
    </div> 
  </div>
</template>

<script>
import axios from "axios";
import { eventBus } from "../main";

export default {
  name: "BusinessCreateAccount",

  data: function(){
    return {
      accountName : "", 
      password : "",
      address: "",
      name: ""
    }
  }, 

  methods : {
    createAccount : function(){
      axios.post("/api/business", {
        accountName : this.accountName, 
        password : this.password,
        name: this.name,
        address: this.address
      })
      .then((response) => {
        window.console.log("heyyyyyyy"); 
        eventBus.$emit("success-message", response.data.message); 
        window.console.log(response.data); 
        this.$state.username = response.data.business.name; 
        this.$state.isBusiness = true;
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


<style scoped>

.description {
    display: flex;
    justify-content: right;
}
</style>
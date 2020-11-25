<template>
  <div>
    <div> <h1> WELCOME TO ZELP </h1> </div>
        <p>
        Zelp is a platform designed by students in the Cambridge community to keep users 
        informed on local businesses and their practices in the Covid Era.
        Signing your business up for Zelp helps keep the community informed on your 
        business’s safety precauations. The community gives feedback on the policies you 
        display here, and the better you do the safer your customers will feel!
        </p>
    <div>
      <div><input type="text" v-model="name" placeholder="business name" /></div>
      <div><input type="text" v-model="address" placeholder="address" /></div>
      <div><input type="text" v-model="accountName" placeholder="account username" /></div>
      <div><input type="text" v-model="password" placeholder="password" /></div>

      <div><button v-on:click="createAccount">Create Account</button> </div>
      <div><button v-on:click="goUserLogin"> already have an account? </button></div>
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
      .then((response) => { // TODO change to "signin-success"?
        eventBus.$emit("success-message", response.data.message); 
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
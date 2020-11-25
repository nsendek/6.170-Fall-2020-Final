<template>
  <div>
    <div>{{this.$state.username}} </div>

    <div> 
      <input type="text" v-model="username" placeholder="new username" />
      <button v-on:click="updateUsername">update username</button>
    </div>

    <div> 
      <input type="text" v-model="password" placeholder="new password" />
      <button v-on:click="updatePassword">update password</button>
    </div>

    <div><button v-on:click="signout"> SIGN OUT </button></div>
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
      window.console.log("what is going on");
      axios.post("/api/user/signout")
      .then((response) => {
        window.console.log("i did it"); 
        eventBus.$emit("success-message", response.data.message);
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
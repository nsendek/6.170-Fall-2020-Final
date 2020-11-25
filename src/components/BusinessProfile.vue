<template>
  <div>
    <div>{{this.$state.username}} </div>

    <div><v-btn v-on:click="signout"> SIGN OUT </v-btn></div>
    <div class="account-options">
        <h1> Change Account Information </h1>
        <div> 
            <input type="text" v-model="username" placeholder="new username" />
            <v-btn v-on:click="updateBusinessInfo('username')" >update username</v-btn>
        </div>

        <div> 
            <input type="text" v-model="password" placeholder="new password" />
            <v-btn v-on:click="updateBusinessInfo('password')">update password</v-btn>
        </div>

        <div>
            <input type="text" v-model="name" placeholder="new name" />
            <v-btn v-on:click="updateBusinessInfo('name')">update name</v-btn>
        </div>

        <div>
            <input type="text" v-model="address" placeholder="new address" />
            <v-btn v-on:click="updateBusinessInfo('address')">update address</v-btn>
        </div>


        <h1> Change Profile Information </h1>
        Maybe the rest of the profile goes here???
    </div>
    

  </div>
</template>

<script>
import axios from "axios";
import { eventBus } from "../main";

export default {
  name : "BusinessProfile", 

  data: function(){
    return {
      username : "", 
      password : "",
      name: "",
      address: ""
    }
  }, 

  methods : {

    updateBusinessInfo: function(patchType) {
        let content;
        switch (patchType) {
            case 'username':
                content = this.username;
                break;
            case 'password':
                content = this.password;
                break;
            case 'name':
                content = this.name;
                break;
            case 'address':
                content = this.address;
                break;
        }

        axios.patch(`/api/business/${patchType}`, {patchType : content})
        .then((response) => {
            eventBus.$emit("success-message", `${patchType} successfully changed`);
            if (patchType == 'username') {
                this.$state.username = response.data.username;  
            } 
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
        this.$state.isBusiness = false;
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
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


        <h1> Your Badges </h1>

        <div class="badges">

          <div class="badges" v-for="(badge,idx) in badges" :key="idx">
            <v-menu
              v-model="badge.menu"
              :close-on-content-click="false"
              :nudge-width="200"
              :key="idx"
              bottom
              offset-y
            >
              <template v-slot:activator='{on, attrs}'>
                <v-chip 
                  style="margin: 5px;" 
                  :key="idx"
                  v-on = 'on'
                  v-bind='attrs'>
                    {{badge.label}}
                </v-chip>
              </template>
              <v-card>
                <v-list>
                  <v-list-item-content>
                    <v-list-item-title>Badge Information</v-list-item-title>
                    <v-list-item-title>Affirm / Deny Ratio: TBD</v-list-item-title>
                  </v-list-item-content>

                  <v-btn
                   color="red"
                   v-on:click="deleteBadge(idx)"
                  > Delete Badge </v-btn>
                </v-list>

              </v-card>
            </v-menu>
          </div>

        </div>



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
      address: "",
      businessID: null,
      badges: [],
      menu: false,
    }
  }, 

  mounted: function() {
    this.getBadges();
  },

  methods : {

    getBadges: function() {
      axios.get(`/api/business/account/${this.$state.username}`)
      .then((response) => {
        this.businessID = response.data.id;
        axios.get(`/api/business/${this.businessID}/badges`)
        .then((response) => {
          this.badges = response.data;
          this.badges.forEach((badgeObject) => badgeObject.menu = false);
        })
      })
      .catch((error) => {
        window.console.log(error.response); 
      })
    },

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

    deleteBadge: function(idx) {
      if (confirm("Are you sure you want to delete this badge?")) {
        let badgeID = this.badges[idx].id;
        axios.delete(`api/badge/${badgeID}`)
        .then(() => {
          eventBus.$emit("success-message", "Badge deleted successfully");
          this.badges = this.badges.filter((badge,index) => index !== idx);
        })
        .catch((error) => {
          console.log(error);
          eventBus.$emit("error-message", error.response.data.error);
        })
      }
    },

    signout : function(){
      axios.post("/api/business/signout")
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

<style scoped>
.badges {
  text-align:vcenter; 
  display: flex;
  flex-direction:row;
  /* justify-content: center; */


}
</style>
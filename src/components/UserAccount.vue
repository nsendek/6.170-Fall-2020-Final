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

    <div>
          <v-dialog
              v-model="dialog"
              max-width="290"
              persistent>
          <template v-slot:activator='{ on, attrs }'>
            <v-btn
                color='red'
                v-bind='attrs'
                v-on='on'
                >Delete Account </v-btn>
          </template>
            <v-card>
              <v-card-title class="headline">
                Are you sure you want delete your account?
              </v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="green darken-1"
                  text
                  @click.stop="dialog = false"
                >
                  No
                </v-btn>
                <v-btn
                  color="green darken-1"
                  text
                  @click.stop="dialog = false"
                  v-on:click="deleteAccount"
                >
                  Yes
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
    </div>

    <div><v-btn v-on:click="goUserProfile" class="wide-button"> back to profile </v-btn></div>
    <div><v-btn v-on:click="signout" class="wide-button"> SIGN OUT </v-btn></div>
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
      password : "",
      dialog: false,
      badges: [],
      rankedBadges: [],
      editBadges: false,

    }
  }, 

  mounted: function() {
    this.loadBadges();
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
    // Loads all badge types
    loadBadges: function() {
          axios.get("/api/badge")
          .then((res) => {
              this.badges = res.data ? res.data : [];
              axios.get("/api/user/rank")
              .then((res) => {
                // Done conditionally if user is not in user_badges db
                // console.log("what is response?", res.data);
                if (res.data === []) {
                  // default ranking --> not stored in db
                  // signals better where to drag? can be set empty here as well.
                  this.badges = this.badges.slice(3, this.badges.length+1);
                  this.rankedBadges = this.badges.slice(0,3);
                } else {
                  this.rankedBadges = res.data;
                  this.badges = this.badges.filter((badge) => !this.rankedBadges.map((badge) => badge.label).includes(badge.label));
                }
              })
              .catch((error) => {
                console.log(error);
                this.rankedBadges = [];
              })

          })
      },
    
    updateUserPrefs: function() {
      console.log("calling this my g");
      const userPrefs = this.rankedBadges.map((badge)=>badge.label).reverse();
      eventBus.$emit("edit-prefs-success");
      axios.post("api/user/rank", {badges : userPrefs})
      .then(() => {
        window.console.log("Policy preferences update successful");
      })
      .catch((error) => {
        console.log(error.response);
        window.console.log("Unable to update preferences");
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

    goUserProfile : function() {
      eventBus.$emit("show-user-profile"); 
    }, 

    signout : function(){
      axios.post("/api/user/signout")
      .then((response) => {
        eventBus.$emit("success-message", response.data.message);
        eventBus.$emit("signout-success");
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
        eventBus.$emit("success-message",  "Account deleted successfully");
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

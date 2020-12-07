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
    <br><br>
    <div class="secondary-header">
      Policy Preferences
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-icon
            color="primary"
            dark
            v-bind="attrs"
            v-on="on"
          >
            mdi-information-outline
          </v-icon>
        </template>
        <span>Rank your 3 most important safety policies here,
           and we will try to show you the businesses with the best ratings in those
           categories whenever you apply filters!</span>
      </v-tooltip>
    </div>
    <div v-if="!(editBadges)">
        <div v-for="(badge, index) in topBadges" :key="index">
          <v-chip>{{badge.label}}</v-chip>
          </div>
          <v-btn slot="footer" @click="editBadges = true">Edit Preferences</v-btn>
        </div>
    <div v-else>
      <draggable v-model="badges" group="people" @start="drag=true" @end="drag=false">
        <div v-for="(badge, index) in badges" :key="index">
          <v-tooltip right>
            <template v-slot:activator="{ on, attrs }">
            <v-chip
             :key = "index"
             v-on = "on"
             v-bind ="attrs"
             :color="(index < 3)? 'green' : '' "
             >{{badge.label}}</v-chip>
            </template>
            <span>{{badge.description}}</span>
          </v-tooltip>
        </div>
          <v-btn slot="footer" @click="editBadgePrefs">Done</v-btn>
      </draggable>   
    </div>

  </div>
</template>

<script>
import axios from "axios";
import { eventBus } from "../main";
import draggable from 'vuedraggable'

export default {
  name : "UserProfile", 

  components: {
    draggable,
  },

  data: function(){
    return {
      username : "", 
      password : "",
      dialog: false,
      badges: [],
      topBadges: [],
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
              this.topBadges = this.badges.slice(0,3);
          })
      },

    editBadgePrefs: function() {
      this.editBadges = false;
      console.log(this.badges.map((badge) => badge.label));
      this.topBadges = this.badges.slice(0,3);
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
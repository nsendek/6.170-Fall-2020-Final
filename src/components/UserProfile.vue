<template>
  <div class="center-container smaller-top">
    <div class="big-title">{{this.$state.username}} </div>
    <div class="secondary-header">
      Policy Preferences
      <v-tooltip open-delay="500" max-width="200px" right>
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
        <span>This helps us organize your results when applying filters on the main page.</span>
      </v-tooltip>
    </div>
    <div class="importance"> <span> least important </span> <span> most important </span></div>
    <div >
      <div class="drag-class">
      <draggable 
        class="draggables"
        v-model="rankedBadges"
        group="badges"
        @start="drag=true" @end="drag=false"
        v-on:change="updateUserPrefs">
        <span class="p-2" v-for="(badge, index) in rankedBadges" :key="index">
          <div 
          class="icon-button"
          style ="margin: 0px 10px; white-space: nowrap;"
          > 
          <BadgeIcon :badgeLabel=badge.label :size="40" :border="10" button/>
          {{badge.label}}
          </div>
        </span> 
      </draggable>
      </div>
    </div>
    <br><br>
    <br><br> <br><br>
    <div class="subtitle"> other policies </div> 
    <div class="slightly-opaque"> <span> Rank your most important policies by dragging them to the top row! </span> </div>
    <center>
      <div class="drag-class">
      <draggable v-model="badges" group="badges" @start="drag=true" @end="drag=false" class="draggables">
        <span v-for="(badge, index) in badges" :key="index">
          <v-tooltip open-delay="500" max-width="200px" bottom>
            <template v-slot:activator="{ on, attrs }">
            <div 
            class="icon-button" 
            style ="margin: 0px 10px; white-space: nowrap;"
            v-on="on"
            v-bind="attrs"
            > 
              <BadgeIcon :badgeLabel=badge.label :size="40" :border="10"/>
              {{badge.label}}
            </div>
            </template>
            <div style="text-align:center;" >{{badge.description}}</div>
          </v-tooltip>
        </span>
      </draggable>  
      </div> 
    </center>
    <br><br>

    <div class="space-above"><v-btn v-on:click="goUserAccount" class="wide-button"> edit personal info </v-btn></div>
    <div class="space-below"><v-btn v-on:click="signout" class="wide-button"> SIGN OUT </v-btn></div>
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
    BadgeIcon: () => import("./BadgeIconAlt"),
  },

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
      // eventBus.$emit("edit-prefs-success");
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

    goUserAccount : function() {
      eventBus.$emit("show-user-account"); 
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

<style scoped>
  .full-width{
    width: 110%;
    margin-top: 50px;
  }

  .space-above{
    margin-top: 120px; 
  }

  .space-below{
    margin-top: 20px; 
    margin-bottom: 10px; 
  }

  .drag-class{
    /* width: 70%; 
    overflow-x: scroll; 
    margin: 0 auto; */
    
  }

  .widee{
    width: 200px; 
  }

  .draggables{
    margin-top: -200px;
    padding-top: 20px; 
    margin: 20px; 
    height: 100px; 
    position:absolute;
    display: flex; 
    flex-direction: row;
    left:0;
    right:0;
    float: left;
    overflow-y: visible;
    overflow-x: scroll; 
    scrollbar-width: thin;
  }

.draggables::-webkit-scrollbar-track
{
  -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
  border-radius: 10px;
  background-color: var(--v-info-window-base);
}

.draggables::-webkit-scrollbar
{
  height: 6px;
  background-color: var(--v-info-window-base);
}

.draggables::-webkit-scrollbar-thumb
{
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
  background-color: var(--v-splitter-hover-base);
}

.smaller-top{
  max-height : calc(99vh - (var(--navbar-height) + var(--navbar-height))) !important;
  overflow-y: scroll;
}

.subtitle{
  font-size: 25px; 
  margin-top: 20px; 
  margin-bottom: -20px; 
}

.slightly-opaque{
  opacity: 50%; 
  margin-top: 20px; 
  margin-bottom: -10px; 
  
}

.importance{
  font-size: 14px; 
  width: 120%; 
  color: var(--v-accent-base); 
  display: flex; 
  justify-content: space-between;
  margin-bottom: -20px; 
  margin-top: 20px; 
  font-style: italic;
  font-weight: 700;
}
</style>
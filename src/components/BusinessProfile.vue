<template>
  <div>
    <div class="big-title">{{this.business.name}} </div>

    <div class="account-options">
      <router-link :to="`/business/${$state.id}`">
        <h3>View Your Public Page</h3>
      </router-link>

        <h1> Your Safety Policies </h1>
        <br><br>
        <div class="badges">

          <div class="badges"
           v-for="(badge,idx) in badges" :key="idx">
            <v-dialog
              v-model="deleteBadgeDialog"
              max-width="290"
              :retain-focus = "false"
            >
              <template v-slot:activator='{on: dialog, attrs}'>
                <v-tooltip bottom>
                  <template v-slot:activator='{on:tooltip}'>
                    <v-icon color="red" > mdi-minus </v-icon>
                    <div
                     v-on="{...tooltip, ...dialog }"
                     v-bind="attrs"
                     style="margin: 5px 5px;">  
                      <BadgeIcon button :badgeLabel=badge.label :size="50" :border="10" :color="getBadgeTier(badge)"/>
                    </div>
                  </template>
                <v-card
                >
                  <v-card-title class="headline">Policy Stats</v-card-title>
                  <v-card-subtitle> {{badge.label}} </v-card-subtitle>
                  <v-card-subtitle> Total Reviews: {{badge.affirms + badge.denies}} </v-card-subtitle>
                  <v-card-subtitle> Affirms: {{ badge.affirms }} </v-card-subtitle>
                  <v-card-subtitle> Denies: {{  badge.denies }} </v-card-subtitle>
                  <v-card-subtitle> Affirm Percentage: {{ badge.ratio }}%</v-card-subtitle>

                </v-card> 
                </v-tooltip>
              </template>
              <v-card>
                <v-card-title class="headline">
                  Are you sure you want to delete this badge?
                </v-card-title>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                      color="green darken-1"
                      text
                      @click.stop="deleteBadgeDialog = false"
                    >
                      No
                    </v-btn>
                    <v-btn
                      color="green darken-1"
                      text
                      @click.stop="deleteBadgeDialog = false"
                      v-on:click="deleteBadge(badgeIndex)"
                    >
                      Yes
                    </v-btn>
                  </v-card-actions>
              </v-card>
            </v-dialog>
          </div>
        </div>
        <br><br>
        <h1> Add Safety Policies </h1>
        <br>
        <div class="badges">

          <div class="badges" v-for="(badge,idx) in otherBadges" :key="idx">
            
            <v-dialog
              v-model="addBadgeDialog"
              max-width="290"
              :retain-focus = "false"
            >
              <template v-slot:activator='{on: dialog, attrs}'>
                <v-tooltip bottom>
                  <template v-slot:activator='{on:tooltip}'>
                    <v-icon color="green" > mdi-plus </v-icon>
                    <div
                     v-on="{...tooltip, ...dialog }"
                     v-bind="attrs"
                     style="margin: 5px 5px;">  
                      <BadgeIcon button :badgeLabel=badge.label :size="50" :border="10" />
                    </div>
                    
                  </template>
                  <div style="text-align:center;"><b><u>{{badge.label}}</u></b></div>
                  <div style="text-align:center;">{{badge.description}}</div>
                </v-tooltip>
              </template>
              <v-card>
                <v-card-title class="headline">
                  Are you sure you want to add this badge?
                </v-card-title>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                      color="green darken-1"
                      text
                      @click.stop="addBadgeDialog = false"
                    >
                      No
                    </v-btn>
                    <v-btn
                      color="green darken-1"
                      text
                      @click.stop="addBadgeDialog = false"
                      v-on:click="addBadge(badgeIndex)"
                    >
                      Yes
                    </v-btn>
                  </v-card-actions>
              </v-card>
            </v-dialog>
          </div>
        </div>
      
    </div>
    <div><center><v-btn v-on:click="goBusinessAccount" class="wide-button"> change account information </v-btn></center></div>
    <div><center><v-btn v-on:click="signout" class="wide-button"> SIGN OUT </v-btn></center></div>
  </div>
  
</template>

<script>
import axios from "axios";
import { eventBus } from "../main";

export default {
  name : "BusinessProfile", 

  components: {
    BadgeIcon: () => import("./BadgeIconAlt"),
  },

  data: function(){
    return {
      username : "", 
      password : "",
      name: "",
      address: "",
      // businessID: null,
      badges: [],
      otherBadges: [],
      // binders for dialogue boxes
      addBadgeDialog:false,
      deleteBadgeDialog:false,
      deleteAccountDialog:false,
      badgeIndex: 0,
      business: {}
    }
  }, 

  created: function() {
    this.getBadges();
    this.loadBusiness(); 
  },

  methods : {

    async loadBusiness() {
      let response = await axios.get(`/api/business/${this.$state.id}`);
      if (response.status == 200) {
        this.business = response.data;
      }
    }, 

    goBusinessAccount : function(){
      eventBus.$emit("show-business-account"); 
    }, 

    getBadges: function() {
      axios.get(`/api/business/${this.$state.id}/badges`)
      .then((response) => {
        this.badges = response.data;
        this.badges.forEach((badge)=> this.getBadgeRatio(badge))
        this.getOtherBadges();
       
      })
      .catch((error) => {
        console.log(error.response);
        window.console.log("Unable to get your badges"); 
      })
    },

    getOtherBadges: function() {
      axios.get('/api/badge')
      .then((response) => {
        let badgesOwned = this.badges.map((badgeObject) => badgeObject.label);

        this.otherBadges = response.data.filter((badgeObject) => !(badgesOwned.includes(badgeObject.label)));
      })
      .catch((error) => {
        window.console.log(error.response);
      })
    },

    getBadgeRatio: function(badge) {
      axios.get(`/api/badge/${badge.id}/ratio`)
      .then((response) => {
        this.$set(badge, 'ratio', response.data.ratio);
        this.$set(badge, 'affirms', response.data.affirms);
        this.$set(badge, 'denies', response.data.denies);
      })
      .catch((error) => {
        console.log(error.response);
        this.$set(badge, 'ratio', "Not available");
        this.$set(badge, 'affirms', "Not available");
        this.$set(badge, 'denies', "Not available");
      });
    },

    getBadgeTier(badge) {
      if (badge.ratio > 80 && (badge.affirms + badge.denies >= 10)) {
          return "gold";
      } else if (badge.ratio > 50) {
          return "silver";
      } else {
          return "bronze";
      }
    },

    updateBusinessInfo: function(patchType) {
        let content;
        switch (patchType) {
            case 'accountName':
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
        axios.patch(`/api/business/${patchType}`, {[patchType] : content})
        .then((response) => {
            eventBus.$emit("success-message", `${patchType} successfully changed`);
            if (patchType == 'accountName') {
                this.$state.username = response.data.accountName;  
            } 
        })
        .catch((error) => { 
            eventBus.$emit("error-message", error.response.data.error); 
        });
    },

    deleteBadge: function(idx) {
      let badgeDeleted = this.badges[idx];
      axios.delete(`api/badge/${badgeDeleted.id}`)
      .then(() => {
        eventBus.$emit("success-message", "Badge deleted successfully");
        eventBus.$emit("edit-badge-success");
        this.badges = this.badges.filter((badge,index) => index !== idx);
        this.getOtherBadges();
      })
      .catch((error) => {
        console.log(error);
        eventBus.$emit("error-message", "Unable to delete badge");
      })
      
    },

    addBadge: function(idx) {
        let badgeLabel = this.otherBadges[idx].label;
        axios.post('api/badge' , {label : badgeLabel})
        .then((response) => {
          eventBus.$emit("success-message", "Badge added successfully");
          eventBus.$emit("edit-badge-success");
          this.otherBadges = this.otherBadges.filter((badgeObject, index) => index != idx);
          let badgeAdded = response.data;
          this.badges.push(badgeAdded);
          this.getBadgeRatio(badgeAdded);

        })
        .catch((error) => {
          console.log(error);
          eventBus.$emit("error-message", "Unable to add badge");
        });
      

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
    },


    deleteAccount: function() {
      axios.delete('api/business')
      .then(() => {
        eventBus.$emit("success-message", "Account deleted successfully");
        this.$state.username = ""; 
        this.$state.isBusiness = false;
        this.$router.push('/');
      })
      .catch((error) => {
        console.log(error.response.data.error);
        eventBus.$emit("error-message", "Unable to delete this account"); 
      })
      }
    }
}
</script>

<style scoped>
.badges {
  text-align:vcenter; 
  display: flex;
  flex-direction:row;
  flex-wrap: wrap;
  justify-content: center;
}

  .why{ 
    margin: 7px; 
    display: flex; 
    align-content: center;
    justify-content: center;
  }
  .please{
    background: transparent !important;
    color: transparent; 
  }

  .v-btn-toggle {
    /* border-radius: 100px; */
    margin: 10px 0px; 
    overflow: scroll;
  }
</style>


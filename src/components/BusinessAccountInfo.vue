<template>
  <div>
    <div class="secondary-header">{{this.business.name}} </div>

    <div class="account-options">
      <router-link :to="`/business/${$state.id}`">
        <h3>View Your Public Page</h3>
      </router-link>

        <h1> Change Account Information </h1>
        
        <div> 
            <input type="text" v-model="username" placeholder="new username" />
            <v-btn v-on:click="updateBusinessInfo('accountName')" >update username</v-btn>
        </div>

        <div> 
            <input type="text" v-model="password" placeholder="new password" />
            <v-btn v-on:click="updateBusinessInfo('password')">update password</v-btn>
        </div>

        <div>
            <input  type="text" v-model="name" placeholder="new name" />
            <v-btn v-on:click="updateBusinessInfo('name')">update name</v-btn>
        </div>

        <div>
            <input type="text" v-model="address" placeholder="new address" />
            <v-btn v-on:click="updateBusinessInfo('address')">update address</v-btn>
        </div>


        <div><center><v-btn v-on:click="backToProfile" class="wide-button"> back to profile </v-btn></center></div>
        <div><center><v-btn v-on:click="signout" class="wide-button"> SIGN OUT </v-btn></center></div>

        <div>
          <br><br><br>
          <v-dialog
              v-model="deleteAccountDialog"
              max-width="290"
              :retain-focus = "false"
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
                  @click.stop="deleteAccountDialog = false"
                >
                  No
                </v-btn>
                <v-btn
                  color="green darken-1"
                  text
                  @click.stop="deleteAccountDialog = false"
                  v-on:click="deleteAccount()"
                >
                  Yes
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </div>
      
    </div>
  </div>
  
</template>

<script>
import axios from "axios";
import { eventBus } from "../main";

export default {
  name : "BusinessAccountInfo", 

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
    this.loadBusiness();
  },

  methods : {

    async loadBusiness() {
      let response = await axios.get(`/api/business/${this.$state.id}`);
      if (response.status == 200) {
        this.business = response.data;
      }
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

    backToProfile : function(){
      eventBus.$emit("show-business-profile"); 
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


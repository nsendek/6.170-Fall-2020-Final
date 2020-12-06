<template>
  <div>
    <div class="secondary-header">{{$state.username}} </div>

    <div><center><v-btn v-on:click="signout" class="wide-button"> SIGN OUT </v-btn></center></div>

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


        <h1> Your Safety Policies </h1>

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
                    <v-chip 
                      style="margin: 5px;" 
                      :key="idx"
                      v-on = "{...tooltip, ...dialog }"
                      v-bind='attrs'
                      input-value="active"
                      filter
                      filter-icon="mdi-minus"
                      @click.stop="badgeIndex=idx">
                      {{badge.label}}
                    </v-chip>
                  </template>
                <!-- <span>{{badge.description}}</span> -->
                <v-card
                >
                  <v-card-title class="headline">Badge Information</v-card-title>
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

        <h1> Add Safety Policies </h1>
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
                    <v-chip 
                      style="margin: 5px;" 
                      :key="idx"
                      v-on = "{...tooltip, ...dialog }"
                      v-bind='attrs'
                      input-value="active"
                      filter
                      filter-icon="mdi-plus"
                      @click.stop="badgeIndex=idx">
                      {{badge.label}}
                    </v-chip>
                  </template>
                <span>{{badge.description}}</span>
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
        <div>
          <br><br><br><br>
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
  name : "BusinessProfile", 

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
      badgeIndex: 0
    }
  }, 

  created: function() {
    this.getBadges();
  },

  methods : {

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
        badge.ratio = 0;
      });
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

</style>
<template>
  <div class="zelp-alert">
    <v-alert 
    prominent
    v-for="(alert,idx) in alerts.slice().reverse()"
    :key="idx"
    :class="alert.type"
    dismissible
    transition="slide-y-transition"
    >
      {{alert.message}}
    </v-alert>
  </div>
</template>
<script>
import axios from "axios";
import { eventBus } from "../main";

export default {
  name: "EventHandler",
  data() {
    return {
      alerts : [],
      lastID : 1,
      maxAlerts : 3,
      timeout : 3000 // 3 sec
    }
  },
  /**
   * confirm that frontend still has an active session with the backend. 
   * if there no longer is a session, delete the cookie as well.
   */
  async beforeCreate() {
    let response = await axios.get("/api/session")
      .catch(err => err.response); 

    if (response.status == 200) {
      if (response.data.user) {
        this.$state.username = response.data.user.username;
        this.$state.id = response.data.user.id;
      } else if (response.data.business) {
        this.$state.username = response.data.business.accountName;
        this.$state.id = response.data.business.id;
      }
    } else {
      this.$state.username = "";
      this.$state.id = 0;
    }
  },
  created: function() {
    eventBus.$on("error-message", (message) => {
      this.addError(message);
    });

    eventBus.$on("success-message", (message) => {
      this.addSuccess(message);
    });
  },
  methods : {
    addSuccess(message) {
      this.addAlert({type: 'success', message, id: this.lastID});
    },
    addError(message) {
      this.addAlert({type: 'error',message, id :this.lastID});
    },
    addAlert(data){
      this.alerts.push(data);
      if (this.alerts.length > this.maxAlerts) this.alerts.splice(0,1);
      this.startTimer(this.lastID);
      this.lastID += 1;
    },
    startTimer(id) {
      setTimeout(() => {
        this.alerts = this.alerts.filter((alert) => (alert.id != id));
      }, this.timeout);
    }
  }
}
</script>
<style  scoped>
.v-alert {
  position: relative;
  color: white;
}

.zelp-alert {
  position: fixed;
  top: 20px;
  left: 0;
  right: 0;
  max-width: 400px;
  margin-left: auto; 
  margin-right: auto; 
  z-index: 1000;
}

.success {
  background-color: rgba(28,193,28,0.8);
}
.error {
  background-color: rgba(245, 39, 39, 0.8);
}
</style>
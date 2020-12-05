<template>
  <!-- var(--navbar-height) is defined in web.css -->
  <v-app-bar app color="nav" flat height="var(--navbar-height)"> 

    <router-link to="/" class="zelp-logo"> <div> ZELP  </div></router-link>
    
    <v-spacer></v-spacer>

    <v-tooltip bottom>
      <template  v-slot:activator="{ on, attrs }">     
        <v-icon
          color = "primary" large
          v-bind="attrs" v-on="on"
          @click="toggleTheme"
        >
          mdi-theme-light-dark
        </v-icon>
      </template>
      Settings
    </v-tooltip>

    <div v-if="!this.$state.username"> 
      <v-tooltip bottom>
        <template  v-slot:activator="{ on, attrs }">
          <router-link to="/login" class="nav-icon"> 
              <v-icon
                color = "primary" large
                v-bind="attrs" v-on="on"
              >
                mdi-login-variant
              </v-icon>
          </router-link>  
        </template>
        LOG IN
      </v-tooltip>
    </div> 
    <div v-else-if="this.$state.username && !(this.$state.isBusiness)"> 
      <v-tooltip bottom>
        <template  v-slot:activator="{ on, attrs }">
            <router-link to="/user-profile" class="nav-icon"> 
              <v-icon
                color = "primary" large
                v-bind="attrs" v-on="on"
              >
                mdi-account-outline
              </v-icon>
            </router-link>
        </template>
        {{this.$state.username}}
      </v-tooltip>
    </div> 
    <div v-else-if="this.$state.username && (this.$state.isBusiness)">
      <v-tooltip bottom>
        <template  v-slot:activator="{ on, attrs }">
            <router-link to="/business-profile" class="nav-icon"> 
              <v-icon
                color = "primary" large
                v-bind="attrs" v-on="on"
              >
                mdi-account-outline
              </v-icon>
            </router-link>
        </template>
        {{this.$state.username}}
      </v-tooltip>
    </div>
  </v-app-bar>
</template>
<script>
import {eventBus} from "../main"
export default {
  name : "NavBar", 
  methods : {
    toggleTheme() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
      eventBus.$emit("theme-change", this.$vuetify.theme.dark);
      this.$cookie.set("theme", this.$vuetify.theme.dark ? "dark" : "light"); 
    }
  }
}
</script>
<style scoped>
header {
  /* DON'T delete, forces navbar to not auto grow/shrink or be absolute. also makes sure navbar is above overlay*/
  z-index : 10 !important;
  position: relative !important;
  max-height: var(--navbar-height) !important;
  min-height: var(--navbar-height) !important;
}
.nav-icon {
  text-decoration: none;
  cursor: pointer;
  margin-left: 10px;
}

/* NAV BAR */
.zelp-logo {
  text-decoration: none;
  font-size : 40px;
  font-weight : 500; 
  letter-spacing: 2px; 
}
</style>
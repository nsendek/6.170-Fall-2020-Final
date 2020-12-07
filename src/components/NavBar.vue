<template>
  <!-- var(--navbar-height) is defined in web.css -->
  <v-app-bar app color="nav" flat height="var(--navbar-height)"> 

    <router-link to="/" class="zelp-logo"> <div> ZELP  </div></router-link>
    
    <v-spacer></v-spacer>

    <v-menu
    v-model="open" transition="slide-x-transition"
    offset-x :close-on-content-click="false"
    left fixed
    >
      <template  v-slot:activator="{ on, attrs }">
        <v-btn @click="open=true" icon v-bind="attrs" v-on="on">
          <v-icon
            class="column-item"
            color = "primary" large
          >
            mdi-magnify
          </v-icon>
        </v-btn>
      </template>
        <v-card class="search-bar" style="margin: 0px; align-items:center;">
            <v-text-field style="margin: 0px 5px;"
              v-model="query" 
              label="Search" required
            />
            <v-btn @click="doSearch" color="primary" style="margin: 0px 5px;">
              SUBMIT
            </v-btn>
        </v-card>
    </v-menu>

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

    <div v-if="!$state.username"> 
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
    <div v-else> 
      <v-tooltip bottom>
        <template  v-slot:activator="{ on, attrs }">
            <router-link :to="($state.isBusiness) ? '/business-profile' : '/user-profile'" class="nav-icon"> 
              <v-icon
                color = "primary" large
                v-bind="attrs" v-on="on"
              >
                mdi-account-outline
              </v-icon>
            </router-link>
        </template>
        {{$state.username}}
      </v-tooltip>
    </div> 
  </v-app-bar>
</template>
<script>
import {eventBus} from "../main"
export default {
  name : "NavBar", 
  data() {
    return {
      open : false,
      query : ''
    }
  },
  methods : {
    toggleTheme() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
      eventBus.$emit("theme-change", this.$vuetify.theme.dark);
      this.$cookie.set("theme", this.$vuetify.theme.dark ? "dark" : "light"); 
    },
    doSearch() {
      if (this.query) {
        this.open = false;
        let searchQuery = `?search=${this.query}`;
        this.query = "";
        if (this.$route.path != `/search${searchQuery}`) this.$router.push(`/search${searchQuery}`);
      } else {
        eventBus.$emit("error-message", "can't search empty query");
      }
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

.search-bar {
  width: 400px; 
  display: flex;
  flex-direction: row;
}

.zelp-logo {
  text-decoration: none;
  font-size : 40px;
  font-weight : 500; 
  letter-spacing: 2px; 
}
</style>
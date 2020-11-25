<template>
  <div class='entire-page'>
    <!-- <div class='full-container'>
        <p style="text-align: center;">Zelp Main Page</p>
        <router-link to="/login"> login </router-link>
    </div> -->
    <nav-bar />
    <div class="panes">
      <div class="business-pane">
        <BusinessFeed/>
      </div>
      <div class="map-pane">
      <GmapMap class="g-map"
        :center="center"
        :zoom="15"
        map-type-id="roadmap"
      >
          <!-- <GmapMarker
              :key="index"
              v-for="(b, index) in businesses"
              :position="{lat : Number(b.lat), lng: Number(b.lng)}"
              :clickable="true"
              @click="log(b)"
            /> -->
      </GmapMap>
      </div>
    </div>

  </div>
</template>

<script>
import { eventBus } from "../main";
import BusinessFeed from "../components/BusinessFeed"
import NavBar from "../components/NavBar"

export default {
  name: "Main",
  components: {
    BusinessFeed,
    NavBar
  },
  data() {
    return {
      center : {lat:42.3601, lng:-71.0942},
      businesses : []
    }
  },
  created() {
    eventBus.$on('businesses', () => {
      // this.businesses = businesses;
      // window.console.log(this.businesses)
    })
  },
  methods: {
    log(b) {
      window.console.log(b.name, b.address);
    }
  }
};
</script>
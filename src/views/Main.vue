<template>
  <div class='entire-page'>
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
        ref="map"
      >
      <GmapMarker
          :key="index"
          v-for="(b, index) in businesses"
          :position="{lat : Number(b.lat), lng: Number(b.lng)}"
          :clickable="true"
          @click="log(b); panTo(b.lat,b.lng)"
        />
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
    eventBus.$on('businesses', (businesses) => {
      this.businesses = businesses;
      if (this.businesses.length ===1){
        let lat = this.businesses[0].lat;
        let lng = this.businesses[0].lng;
        this.$refs.map.$mapPromise.then((map) => {
          console.log(this.businesses[0].lat)
          map.panTo({lat,lng})
        })
      }
      // window.console.log(this.businesses)
    })
  },
  methods: {
    log(b) {
      window.console.log(b.name, b.address);
    },
    panTo(lat,lng){
      this.$refs.map.$mapPromise.then((map) => {
      map.panTo({lat, lng})
    })
    }
  }
};
</script>
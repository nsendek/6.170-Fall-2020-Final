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
          @click="log(b); panTo(b.lat,b.lng);"
          :label = label(b)
          :icon = icon()
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
      center : {lat:42.3601, lng:-71.0943},
      businesses : []
    }
  },
  mounted() {
    eventBus.$on('businesses', (businesses) => {
      this.businesses = businesses;
      if(this && this.$refs && this.$refs.map && this.$refs.map.$mapPromise){
      this.$refs.map.$mapPromise.then((map) => {
      if (businesses.length ===1){
        let lat = businesses[0].lat;
        let lng = businesses[0].lng;
        
          map.panTo({lat,lng})
      }
      else if(businesses.length > 1){
          let minlat = businesses.reduce((prev, curr) => (prev.lat && curr.lat && prev.lat < curr.lat) ? prev : curr)
          let minlng = businesses.reduce((prev, curr) => (prev.lng && curr.lng && prev.lng < curr.lng) ? prev : curr)
          let maxlat = businesses.reduce((prev, curr) => (prev.lat && curr.lat && prev.lat > curr.lat) ? prev : curr)
          let maxlng = businesses.reduce((prev, curr) => (prev.lng && curr.lng && prev.lng > curr.lng) ? prev : curr)
          // console.log(minlat,minlng,maxlat,maxlng)
          // console.log(minlat.lat,minlng.lng,maxlat.lat,maxlng.lng)
          let bounds = ({south:minlat.lat,west:minlng.lng, north:maxlat.lat,east:maxlng.lng})
          this.$refs.map.$mapObject.fitBounds(bounds,0);
      }
        })
      }
    })
  },
  methods: {
    log(b) {
      window.console.log(b.name, b.address);
    },
    label(b) {
      return b.name;
    },
    icon() {
      return {url: "https://cdn.pixabay.com/photo/2020/04/29/10/06/mouth-guard-5108188_1280.png", scaledSize: {width:70, height:70}};
    },
    panTo(lat,lng){
      this.$refs.map.$mapPromise.then((map) => {
      map.panTo({lat, lng})
    })
    }
  }
};
</script>
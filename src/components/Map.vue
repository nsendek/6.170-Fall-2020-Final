<template>
    <GmapMap class = "g-map"
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
</template>
<script>
import { eventBus } from "../main";

export default {
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
    panTo(lat,lng){
      this.$refs.map.$mapPromise.then((map) => {
      map.panTo({lat, lng})
    })
    }
  }
}
</script>
<style scoped>
.g-map{
  height : calc(100vh - 65px);
  height: -o-calc(100vh - 65px);
  height: -webkit-calc(100vh - 65px);
  height: -moz-calc(100vh - 65px);
}
</style>
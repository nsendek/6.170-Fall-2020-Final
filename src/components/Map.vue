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
        :label="label(b)"
        :icon = icon()
        :ref="'marker'+b.id"
      />
    </GmapMap>
</template>
<script>
import {eventBus } from "../main";
import {gmapApi}from 'vue2-google-maps';
import axios from "axios";

export default {
  data() {
    return {
      center : {lat:42.3601, lng:-71.0943},
      businesses : [],
    }
  },
  computed: {
    google : gmapApi
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
      this.$refs.map.$mapPromise.then((map) => {
      axios.get(`/api/business/${b.id}/badges`)
            .then((res) => {
                this.badges = res.data ? res.data.map(badge => badge.label) : [];
      let vuebadges = "";
      for (let badge in this.badges){
        vuebadges += "<v-chip style=\"margin: 5px;\" :key=" + badge + "> " + this.badges[badge] + " </v-chip>\n"
      }
      let content = `
          <v-card  v-if="business" style = "padding: 5px; display:flex; flex-direction:column; align-items:center;">
            <div class = "secondary-header"> <a href = "/business/`+ b.id +`">`+b.name+`</a> </div>
            <div class = "quarternary-header"> `+b.address+`</div>
            <div style="text-align:center;">
                `+vuebadges+`
            </div>
          </v-card>`
      
      // let infowindow = new window.google.maps.InfoWindow({content:"<iframe height = 800 width = 500 src=business/"+b.id+"/>"});
      let infowindow = new window.google.maps.InfoWindow({content:content, options:{pixelOffset: {width: 0,height: -35}}});
      infowindow.setPosition({lat:b.lat,lng:b.lng});
      infowindow.open(map);
            })
      })
      window.console.log(b.name, b.address);
    },
    label(b) {
      return{text:String(1+this.businesses.indexOf(b)), fontSize: "25px", fontWeight:"800", color: "black"};
    },
    icon() {
      return {url: "https://cdn.pixabay.com/photo/2020/04/29/10/06/mouth-guard-5108188_1280.png", scaledSize: {width:40, height:40}};
    },
    panTo(lat,lng){
      this.$refs.map.$mapPromise.then((map) => {
      map.panTo({lat, lng})
    })
    }
  }
}
</script>
<style>
.g-map{
  /* DON'T delete below */
  height : calc(100vh - var(--navbar-height));
}
</style>
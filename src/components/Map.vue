<template>
<div>
  <v-btn @click="geolocate()">Go To Current Location</v-btn>
    <GmapMap class = "g-map"
      :center="center"
      :zoom="15"
      map-type-id="roadmap"
      ref="map"
      :options="options"
    >
    <GmapMarker
        :key="index"
        v-for="(b, index) in businesses"
        :position="{lat : Number(b.lat), lng: Number(b.lng)}"
        :clickable="true"
        @click="clicked(b)"
        :label="label(b)"
        :icon = icon()
      />
    </GmapMap>
</div>
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
      infoWindow : null,
      infoBusiness: null,
      ligthId:"e492156a263e3bf5",
      darkId:"4bd99df653a8171b",
      options:
      {mapId: "e492156a263e3bf5" }
    }
  },
  computed: {
    google : gmapApi
  },
  mounted() {
    eventBus.$on('businesses', (businesses) => {
      this.businesses = businesses;
      if(this && this.$refs && this.$refs.map && this.$refs.map.$mapPromise){
          this.boundBox(businesses,10);
      }
    })
  }, created(){
      this.geolocate();
      eventBus.$on('clicked', (b,bview) => {
        this.clicked(b,bview);
      })
  },
  methods: {
    boundBox(l,b){
      let minlat = l.reduce((prev, curr) => (prev.lat && curr.lat && prev.lat < curr.lat) ? prev : curr)
      let minlng = l.reduce((prev, curr) => (prev.lng && curr.lng && prev.lng < curr.lng) ? prev : curr)
      let maxlat = l.reduce((prev, curr) => (prev.lat && curr.lat && prev.lat > curr.lat) ? prev : curr)
      let maxlng = l.reduce((prev, curr) => (prev.lng && curr.lng && prev.lng > curr.lng) ? prev : curr)
      // console.log(minlat,minlng,maxlat,maxlng)
      // console.log(minlat.lat,minlng.lng,maxlat.lat,maxlng.lng)
      let bounds = ({south:minlat.lat,west:minlng.lng, north:maxlat.lat,east:maxlng.lng})
      this.$refs.map.$mapObject.fitBounds(bounds,b);
    },
    markerSelected(b,map){
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
      this.infoWindow = new window.google.maps.InfoWindow({content:content, options:{pixelOffset: {width: 0,height: -35}}});
      this.infoWindow.setPosition({lat:b.lat,lng:b.lng});
      // console.log(this.infoWindow);
      this.boundBox(this.businesses,10);
      this.infoWindow.open(map);
      this.infoBusiness = b;
            })
    }, geolocate() {
        console.log("here!");
      navigator.geolocation.getCurrentPosition(position => {
        let lat = parseFloat(position.coords.latitude);
        let lng = parseFloat(position.coords.longitude);
        if(this && this.$refs && this.$refs.map && this.$refs.map.$mapPromise){
          this.$refs.map.$mapPromise.then((map) => {
            new window.google.maps.Marker({
              position: {lat: lat, lng: lng },
                map,
                title: "Your Location",
              });
              this.boundBox(this.businesses.concat([{lat: lat, lng: lng }]),80);
              // console.log(lat,lng);
        })
        }
        })
    },
    markerUnselected(){
      this.infoWindow.close();
      this.infoWindow = null;
    },
    clicked(b,bview=false) {
      this.panTo(b.lat,b.lng);
      this.$refs.map.$mapPromise.then((map) => {

      // let infowindow = new window.google.maps.InfoWindow({content:"<iframe height = 800 width = 500 src=business/"+b.id+"/>"});
      if (this.infoWindow) {
        if (!(bview && b.id == this.infoBusiness.id)){
        this.markerUnselected();
        if (this.infoBusiness && b.id != this.infoBusiness.id) this.markerSelected(b,map);
        }
      }
      else{
        this.markerSelected(b,map);
      }
            })
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
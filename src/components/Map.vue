<template>
<div class = "map-container" >
    <GmapMap class = "g-map"
      :center="center"
      :zoom="15"
      map-type-id="roadmap"
      ref="map"
      :key="mapId"
      :options="{ mapId }"
    >
    <GmapMarker
        :key="index"
        v-for="(b, index) in businesses"
        :position="{lat : Number(b.lat), lng: Number(b.lng)}"
        :clickable="true"
        @click="clicked(b)"
        :label="label(b)"
        :icon="{url: 'https://i.ibb.co/3Cz4TX7/pin2.png',scaledSize:{width:30,height:30}}"
        @mouseover ="iconHover(index)"
        @mouseout ="iconOff(index)"
        ref="markers"
      />
    </GmapMap>
     <v-btn class="location-btn" @click="geolocate()" >Go To Current Location</v-btn>
</div>
</template>
<script>
import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import {eventBus } from "../main";
import {gmapApi}from 'vue2-google-maps';
import InfoWindow from "./InfoWindow"

export default {
  data() {
    return {
      center : {lat:42.3601, lng:-71.0943},
      businesses : [],
      infoWindow : null,
      infoBusiness: null,
      ligthId:"e492156a263e3bf5",
      darkId:"4bd99df653a8171b",
      mapId : "",
      // lastBounds : null
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
  }, 
  created(){
    this.mapId = this.$vuetify.theme.isDark ? this.darkId : this.ligthId;
    eventBus.$on('clicked', (b,bview) => {
      this.clicked(b,bview);
    })
    eventBus.$on('theme-change', (dark) => {
      this.mapId = dark ? this.darkId : this.ligthId;
      // this.lastBounds = this.$refs.map.$mapObject.getBounds();
    })
  },
  updated() {
    this.boundBox(this.businesses, 0);
  },
  methods: {
    async boundBox(l,b){ 
      // if (this.lastBounds) { 
      //   let map = await this.$refs.map.$mapPromise;  
      //   map.fitBounds(this.lastBounds, 0);
      //   this.lastBounds = null;
      // } else {
      let minlat = l.reduce((prev, curr) => (prev.lat && curr.lat && prev.lat < curr.lat) ? prev : curr)
      let minlng = l.reduce((prev, curr) => (prev.lng && curr.lng && prev.lng < curr.lng) ? prev : curr)
      let maxlat = l.reduce((prev, curr) => (prev.lat && curr.lat && prev.lat > curr.lat) ? prev : curr)
      let maxlng = l.reduce((prev, curr) => (prev.lng && curr.lng && prev.lng > curr.lng) ? prev : curr)

      let bounds = ({south:minlat.lat,west:minlng.lng, north:maxlat.lat,east:maxlng.lng})
      let map = await this.$refs.map.$mapPromise;

      map.fitBounds(bounds,b);
      // }
    },
    markerSelected(b,map){
      //       axios.get(`/api/business/${b.id}/badges`)
      //       .then((res) => {
      //           this.badges = res.data ? res.data.map(badge => badge.label) : [];
      // let vuebadges = "";
      // for (let badge in this.badges){
      //   vuebadges += "<v-chip style=\"margin: 5px;\" :key=" + badge + "> " + this.badges[badge] + " </v-chip>\n"
      // }
      // let content = `
      //     <v-card  v-if="business" style = "padding: 5px; display:flex; flex-direction:column; align-items:center;">
      //       <div class = "secondary-header"> <a href = "/business/`+ b.id +`">`+b.name+`</a> </div>
      //       <div class = "quarternary-header"> `+b.address+`</div>
      //       <div style="text-align:center;">
      //           `+vuebadges+`
      //       </div>
      //     </div>`

      // if (this.infoWindow) this.infoWindow.close(map);
      
      // this.infoWindow = new window.google.maps.InfoWindow({content:content, options:{pixelOffset: {width: 0,height: -35}}});
      // this.infoWindow.setPosition({lat:b.lat,lng:b.lng});
      // // console.log(this.infoWindow);
      // this.boundBox(this.businesses,10);
      // this.infoWindow.open(map);
      
      // this.infoBusiness = b;
      //       })

      if (this.infoWindow) {
        this.infoWindow.close(map);
      }

      let InfoWindowComponent = Vue.extend(InfoWindow);
      let instance = new InfoWindowComponent({
          router : this.$router,
          vuetify : new Vuetify({
  theme: {
    options: {
      customProperties: true
    },
    themes: {
      light: {
        nav : "#fff",
        background : "#fff",
        splitter : "#eee",
        'splitter-hover' : "#ddd",
        'splitter-handle' : "#424242",
        'button-group' : "#eee"
      },
      dark : {
        nav : "#121212",
        background : "#121212",
        splitter : "#323232",
        'splitter-hover' : "#525252",
        'splitter-handle' : "#aaa",
        'button-group' : "#222"
      }
    }
  },
  icons : {
    values: {
      '6_ft_apart' : {
        component: () => import("../assets/icons/6_ft_apart.vue")
      },
      'adequate_supplies' : {
        component: () => import("../assets/icons/adequate_supplies.vue")
      },
      'curbside_pickup' : {
        component: () => import("../assets/icons/curbside_pickup.vue")
      },
      'disinfection' : {
        component: () => import("../assets/icons/disinfection.vue")
      },
      'indoor_dining' : {
        component: () => import("../assets/icons/indoor_dining.vue")
      },
      'low_density' : {
        component: () => import("../assets/icons/low_density.vue")
      },
      'masks_required' : {
        component: () => import("../assets/icons/masks_required.vue")
      },
      'outdoor_dining' : {
        component: () => import("../assets/icons/outdoor_dining.vue")
      },
      'trained_workers' : {
        component: () => import("../assets/icons/trained_workers.vue")
      },
    }
  }
}),
          propsData: {
              business: b
          }
      });
      instance.$mount();

      this.infoWindow = new window.google.maps.InfoWindow({content: instance.$el, options:{pixelOffset: {width: 0,height: -35}}});
      this.infoWindow.setPosition({lat:b.lat,lng:b.lng});

      window.google.maps.event.addListener(this.infoWindow,'closeclick',() => {
        this.markerUnselected();
      });

      this.boundBox(this.businesses,10);
      this.infoWindow.open(map);
      this.infoBusiness = b;
    }, 
    geolocate() {
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
      if (this.infoWindow) {
        this.infoWindow.close();
        this.infoWindow = null;
      }
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
      return{text:String(1+this.businesses.indexOf(b)), fontSize: "25px", fontWeight:"700", color: "black"};
    },
    async iconHover(markerIndex) {  
      this.$refs.markers[markerIndex].$markerObject.setIcon({url: "https://i.ibb.co/f9j1PkZ/pin1.png",scaledSize:{width:30,height:30}});
    },
    iconOff(markerIndex) {
      this.$refs.markers[markerIndex].$markerObject.setIcon({url: 'https://i.ibb.co/3Cz4TX7/pin2.png',scaledSize:{width:30,height:30}});
    },
    panTo(lat,lng){
      this.$refs.map.$mapPromise.then((map) => {
      map.panTo({lat, lng})
    })
    }
  },
  watch : {
    $vuetify : function() {
      window.console.log("CHANGED");
    }
  }
}
</script>
<style>
.g-map{
  /* DON'T delete below */
  height : calc(100vh - var(--navbar-height));
}

.map-container {
  align-items: center; 
  position: relative;
}

.location-btn {
  text-align: center; 
  position: absolute; 
  bottom:0;
  color: white !important;
  background-color: var(--v-secondary-base) !important;
}
</style>
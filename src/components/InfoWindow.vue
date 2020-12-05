<template>
  <v-card  v-if="business" style = "padding: 5px; display:flex; flex-direction:column; align-items:center;">
    <div class = "secondary-header"> 
       <router-link :to="`/business/${business.id}`" >
        {{business.name}}
      </router-link> 
    </div>
    <div class = "quarternary-header">
      {{business.address}}
    </div>
    <div style="text-align:center;">
      <v-chip small v-for="(badge,idx) in badges" :key="idx">
          {{badge}}
      </v-chip>
    </div>
  </v-card>
</template>
<script>
import axios from "axios";
export default {
  props : {
    business : {
      type : Object,
      default : () => {}
    },
  },
  data() {
    return {
      badges : []
    }
  },
  created() {
    axios.get(`/api/business/${this.business.id}/badges`).then( res => {
        this.badges =  res.data ? res.data.map(badge => badge.label) : [];
    })
  }
}
</script>
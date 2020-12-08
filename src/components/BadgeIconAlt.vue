<template>
    <v-btn :disabled="!button" :height="size+border" :width="size+border" :class="color" icon style ="padding: 10px;">
      <v-icon  elevation="13" :size="size"> 
        ${{iconEnum[badgeLabel]}}
      </v-icon>
    </v-btn>
</template>

<script>
import '../assets/icons/masks_required.png';
export default {
    name: "BadgeIcon",
    props: {
        badgeLabel: String,
        size: Number,
        border : Number,
        color : String,
        button : {
          type : Boolean,
          default : false
      }
    },
    data() {
        return {
            iconEnum: {
                "MASKS REQUIRED" : 'masks_required',
                "6 FT APART": '6_ft_apart',
                "OUTDOOR DINING": 'outdoor_dining',
                "INDOOR DINING": 'indoor_dining',
                "CURBSIDE PICKUP": 'curbside_pickup',
                "DISINFECTION": 'disinfection',
                "TRAINED WORKERS": 'trained_workers',
                "LOW DENSITY": 'low_density',
                "ADEQUATE SUPPLIES": 'adequate_supplies'
            },
        }
    }
}
</script>
<style scoped>
.v-btn.gold {
  background-color: #D4AF37;
}
.v-btn.silver {
  background-color: silver;
}
.v-btn.bronze {
  background-color: #B87333;
}
</style>
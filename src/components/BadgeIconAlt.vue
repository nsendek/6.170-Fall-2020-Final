<template>
    <v-btn :disabled="!button" :height="`${size+border}px`" :width="`${size+border+2}px`" :class="color" icon>
      <v-icon :size="size"> 
        {{iconEnum[badgeLabel]}}
      </v-icon>
    </v-btn>
</template>

<script>
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
                "MASKS REQUIRED" : '$masks_required',
                "6 FT APART": '$6_ft_apart',
                "OUTDOOR DINING": '$outdoor_dining',
                "INDOOR DINING": '$indoor_dining',
                "CURBSIDE PICKUP": '$curbside_pickup',
                "DISINFECTION": '$disinfection',
                "TRAINED WORKERS": '$trained_workers',
                "LOW DENSITY": '$low_density',
                "ADEQUATE SUPPLIES": '$adequate_supplies'
            },
        }
    }
}
</script>
<style scoped>
.v-btn.gold {
  background:linear-gradient(to right, #BF953F, #FCF6BA, #B38728, #FBF5B7, #AA771C);
}
.v-btn.silver {
  background:
  linear-gradient(
        -72deg,
    #dedede,
    #454545 16%,
    #dedede 21%,
    #dedede 24%,
    #454545 27%,
    #dedede 36%,
    #dedede 45%,
    #dedede 60%,
    #dedede 72%,
    #dedede 80%,
    #dedede 84%,
    #454545
  );
}
.v-btn.bronze {
  background:  linear-gradient(
    -72deg,
    #ca7345,
    #ffdeca 16%,
    #ca7345 21%,
    #ffdeca 24%,
    #a14521 27%,
    #ca7345 36%,
    #ffdeca 45%,
    #ffdeca 60%,
    #ca7345 72%,
    #ffdeca 80%,
    #ca7345 84%,
    #732100
  );
}

  .v-btn.red {
    background-color: #e33d40;
  }
  .v-btn.green {
    background-color: #7ae33d;
  }

</style>
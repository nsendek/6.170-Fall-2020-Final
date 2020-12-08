<template>
    <img class="mr-3" 
        :src="require(`../assets/icons/${iconEnum[badgeLabel]}.png`)"
         height = h
         />
</template>

<script>
import '../assets/icons/masks_required.png';
export default {
    name: "BadgeIcon",
    props: {
        badgeLabel: String,
        h: Number,
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
    },

    computed: {
        getIcon(badgeLabel) {
            return this.iconEnum[badgeLabel];
        }
    }
}
</script>
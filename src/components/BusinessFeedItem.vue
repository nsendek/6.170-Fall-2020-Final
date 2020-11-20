<template>

<div class="business-container">

<h3>{{business.name}}</h3>

<i>Address: {{business.address}}</i>

Badges: {{this.badges}}
</div>

</template>


<script>
import axios from "axios";
// import {eventBus} from "../main"

export default {
    name: "BusinessItem",
    props: {
        business: Object
    },
    data() {
        return {
            badges: [],
        }
    },

    mounted: function() {
        this.getBusinessBadges();
    },

    methods: {
        getBusinessBadges: function() {
            axios.get(`/api/business/${this.business.id}/badges`)
            .then((res) => {
                this.badges = res.data ? res.data.map(badge => badge.label) : [];
            })
        }
    }


}
</script>
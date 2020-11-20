<template>
  <div class='entire-page'>
    <div class='full-container'>
        <p style="text-align: center;">Zelp Main Page</p>
    </div>
    <div class="panes">
      <div class="business-pane">
        <BusinessFeed/>
      </div>
      <div class="map-pane">
      <GmapMap class="g-map"
        :center="{lat:42.3601, lng:-71.0942}"
        :zoom="15"
        map-type-id="roadmap"
      >
      </GmapMap>
      </div>
    </div>

  </div>
</template>

<script>
import BusinessFeed from "../components/BusinessFeed"

export default {
  name: "main",
  components: {
    BusinessFeed
  }
};
</script>
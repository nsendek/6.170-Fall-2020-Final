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
      <GoogleMapLoader></GoogleMapLoader>
      </div>
    </div>

  </div>
</template>

<script>
import BusinessFeed from "../components/BusinessFeed"
import GoogleMapLoader from "../components/GoogleMapLoader"
export default {
  name: "main",
  components: {
    BusinessFeed,
    GoogleMapLoader
  }
};
</script>
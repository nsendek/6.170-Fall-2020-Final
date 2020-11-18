<template>
  <div class='entire-page'>
    <div class='full-container'>
        <p style="text-align: center;">Zelp Main Page</p>
    </div>
    <BusinessFeed/>
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
<template>
    <BusinessFeed/>
</template>

<script>
export default {
  name: "Main",
  components: {
    BusinessFeed : () => import("../components/BusinessFeed"),
  }
};
</script>
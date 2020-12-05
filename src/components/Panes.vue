<template>
  <splitpanes class = "vue-theme" @resize="paneResize">
    <pane :size="paneSize" min-size="30"> 
      <slot name = "left"></slot>
    </pane>
    <pane :size="100 - paneSize" min-size="30"> 
      <slot name = "right"></slot>
    </pane>
  </splitpanes>
</template>
<script>
import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'

export default {
  name: "Panes",
  data() {
    return {
      paneSize: 50
    }
  },  
  components : {
    Splitpanes,
    Pane
  },
  created() {
    let size = this.$cookie.get("paneSize");
    if (size) this.paneSize = size;
  },
  methods : {
    async paneResize(e) {      
      this.paneSize = e[0].size;
      this.$cookie.set("paneSize", this.paneSize);
    }
  }
}
</script>
<style>

.splitpanes.vue-theme .splitpanes__splitter:after, 
.splitpanes.vue-theme .splitpanes__splitter:before {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  background-color : var(--v-splitter-handle-base) !important;
  -webkit-transition: background-color .3s;
  transition: background-color .3s;
}

.vue-theme.splitpanes--vertical>.splitpanes__splitter:before, 
.vue-theme .splitpanes--vertical>.splitpanes__splitter:before {
    margin-left: -2px;
}

.vue-theme.splitpanes--vertical>.splitpanes__splitter:after, 
.vue-theme .splitpanes--vertical>.splitpanes__splitter:after,
.vue-theme.splitpanes--vertical>.splitpanes__splitter:before, 
.vue-theme .splitpanes--vertical>.splitpanes__splitter:before {
    -webkit-transform: translateY(-50%);
    transform: translateY(-50%);
    width: 1px;
    height: 50px;
}


.splitpanes.vue-theme .splitpanes__splitter {
  min-width: 10px;
  -webkit-box-sizing: border-box;
  background-color : var(--v-splitter-base) !important;
  box-sizing: border-box;
  position: relative;
  -ms-flex-negative: 0;
  flex-shrink: 0;
}

.vue-theme.splitpanes--vertical>.splitpanes__splitter, 
.vue-theme .splitpanes--vertical>.splitpanes__splitter {
    min-width: 10px;
    border-left: 2px solid var(--v-splitter-base);
    margin-left: -1px;
}
</style>
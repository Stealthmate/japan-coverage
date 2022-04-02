<template>
  <l-map ref="myMap" class="theMap" :max-bounds="maxBounds" :max-bounds-viscosity="1.0">
    <l-polygon :lat-lngs="asiaMask" fillColor="#031726" :opacity="0.0" :fill-opacity="1.0" :interactive="false"></l-polygon>
  </l-map>
</template>

<script>
import L from 'leaflet';
import { LMap } from 'vue2-leaflet';

import TheMapMixin from '../mixins/map';
import TheCoverageMixin from '../mixins/coverage';

export default {
  name: 'TheMap',
  mixins: [TheMapMixin, TheCoverageMixin],
  data() {
    return {
      ready: false,
      pois: [],
      slowState: undefined,
    }
  },
  computed: {
  },
  watch: {
    zoomLevel(v) {
      this.coverageUpdate(v);
    }
  },
  mounted() {
    this.$nextTick(async () => {
      await this.initMap();
      this.ready = true;
      await this.coverageInit(this.map);
      this.map.on('zoomend', (e) => {
        this.zoomLevel = e.target._zoom;
      });
      this.coverageEnabled = true;
      this.coverageUpdate(this.zoomLevel);
    });
  },
  methods: {
  }
}
</script>

<style>
.theMap {
  width: 500px;
  height: 500px;
}
</style>
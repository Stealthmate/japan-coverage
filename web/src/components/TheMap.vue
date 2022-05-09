<template>
  <div class="wrapper">
    <l-map ref="myMap" class="theMap" :max-bounds="maxBounds" :max-bounds-viscosity="1.0">
      <l-polygon :lat-lngs="asiaMask" fillColor="#031726" :opacity="0.0" :fill-opacity="1.0" :interactive="false"></l-polygon>
    </l-map>
    <!-- <ModePick v-model="mode" :values="modes" /> -->
    <icon-patterns />
  </div>
</template>

<script>
import L from 'leaflet';
import { LMap } from 'vue2-leaflet';

import TheMapMixin from '../mixins/map';
import TheCoverageMixin from '../mixins/coverage';
import ModePick from './ModePick';
import ThePOIModeMixin from '../mixins/poiMode';
import IconPatterns from './IconPatterns.vue';

export default {
  name: 'TheMap',
  components: {
    ModePick,
    IconPatterns
  },
  mixins: [TheMapMixin, TheCoverageMixin, ThePOIModeMixin],
  data() {
    return {
      ready: false,
      pois: [],
      slowState: undefined,
      mode: 'coverage'
    }
  },
  computed: {
    modes() {
      return [
        { text: 'Coverage', value: 'coverage' },
        { text: 'POI', value: 'poi' }
      ]
    }
  },
  watch: {
    zoomLevel(v) {
      this.update();
    },
    mode(v) {
      this.update();
    }
  },
  mounted() {
    this.$nextTick(async () => {
      await this.initMap();
      this.ready = true;
      this.map.on('zoomend', (e) => {
        this.zoomLevel = e.target._zoom;
      });
      await this.coverageInit(this.map);
      this.poiModeInit(this.map);

      this.update();
    });
  },
  methods: {
    update() {
      this.coverageEnabled = this.mode === 'coverage';

      this.coverageUpdate(this.zoomLevel);
      this.poiModeUpdate(this.zoomLevel);
    }
  }
}
</script>

<style>
.wrapper {
  width: 100%;
  height: 100%;
}
.theMap {
  width: 500px;
  height: 500px;
}
</style>
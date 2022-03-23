<template>
  <l-map ref="myMap" class="theMap" :max-bounds="maxBounds" :max-bounds-viscosity="1.0">
    <l-polygon :lat-lngs="asiaMask" fillColor="#031726" :opacity="0.0" :fill-opacity="1.0" :interactive="false"></l-polygon>
  </l-map>
</template>

<script>
const INITIAL_POSITION = [39.370157 - 1.5, 137.680664];
// const INITIAL_POSITION = [36.575835, 138.479919];

const INITIAL_ZOOM = 6;

const TOKEN = 'pk.eyJ1Ijoic3RlYWx0aG1hdGUxMjMzIiwiYSI6ImNsMGZkM2l1bzBwcnAzbG12dzNwM3h5dmwifQ.xVloGCoapFY45tn3bMZfZg';


import L from 'leaflet';
import { LMap } from 'vue2-leaflet';

import { geoOffset } from '../geoutils';

import { fetchCityOverlay } from '../api';
import { drawJapanOverlay, poiPin } from '../utils';

import theData from '../assets/data.json';
import { svgOverlay } from 'leaflet';

export default {
  name: 'TheMap',
  data() {
    return {
      ready: false,
      currentLoc: INITIAL_POSITION,
      zoomLevel: INITIAL_ZOOM,
      pois: [],
      slowState: undefined,
    }
  },
  computed: {
    map() {
      return this.$refs.myMap.mapObject;
    },
    maxBounds() {
      return [
          [47.367584, 116.608887],
          [23.53523, 159.609375],
      ];
    },
    asiaMask() {
      return [
        [50.373496, 157.280273],
        [43.34116, 149.084473],
        [45.256702, 145.327148],
        [45.95115, 140.778809],
        [38.925229, 136.582031],
        [35.406961, 130.319824],
        [34.334364, 128.320313],
        [26.784847, 126.474609],
        [24.666986, 122.574463],
        [22.666986, 120.574463],
        [26.843677, 104.875488],
        [48.400032, 115.048828]
      ]
    },
    visitedPrefectures() {
      return theData.reduce((a, x) => {
        if(!a.includes(x.prefecture)) a.push(x.prefecture);
        return a;
      }, []);
    },
    visitedCities() {
      return theData.reduce((a, x) => {
        let city = `${x.prefecture}-${x.city}`;
        if(!a.includes(city)) a.push(city);
        return a;
      }, []);
    }
  },
  watch: {
    zoomLevel(v, vold) {
      this.pois.forEach(x => {
        x[1].classList.remove(`zoom-${vold}`);
        x[1].classList.add(`zoom-${v}`);
      });
      this.zoomPins();
      this.drawHighlight(v);
    }
  },
  mounted() {
    this.$nextTick(async () => {
      await this.init();
      this.ready = true;
    });
  },
  methods: {
    zoomPins() {
      this.pois.forEach(x => {
        x[0].setBounds(this.pinBounds(x[2], 40 / Math.pow(1.3, this.zoomLevel)));
      });
    },
    pinBounds(loc, radius) {
      let tl = geoOffset(loc[0], loc[1], -45.0, radius);
      let br = geoOffset(loc[0], loc[1], 135.0, radius);
      return [tl, br];
    },
    dehighlight() {
      this.overlaySVG.classList.remove('highlight-prefecture');
      this.overlaySVG.classList.remove('highlight-city');
      this.overlaySVG.classList.remove('slow-highlight');
      this.pois.forEach(x => x[1].classList.remove('slow-highlight'));
      this.pois.forEach(x => x[1].classList.remove('highlight'));
    },
    highlightPrefectures() {
      this.overlaySVG.classList.add('highlight-prefecture');
    },
    highlightCities() {
      this.overlaySVG.classList.add('highlight-city');
    },
    smoothHighlight() {
      if(this.zoomLevel > 6) return;
      this.dehighlight();
      this.overlaySVG.classList.add('slow-highlight');
      this.pois.forEach(x => x[1].classList.add('slow-highlight'));
      if(this.slowState === undefined) this.slowState = 2;
      // this.slowState=1;
      switch(this.slowState) {
        case 2: this.overlaySVG.classList.add('highlight-prefecture'); break;
        case 0: this.overlaySVG.classList.add('highlight-city'); break;
        case 1: this.pois.forEach(x => x[1].classList.add('highlight')); break;
      }
      this.slowState = (this.slowState + 1) % 3;
      setTimeout(this.smoothHighlight, 15000);
    },
    drawHighlight(zoomLevel) {
      this.dehighlight();
      if(zoomLevel == 6) {
        this.slowState = 2;
        this.smoothHighlight();
      }
      else if(zoomLevel < 8) this.highlightPrefectures();
      else if(zoomLevel < 9) this.highlightCities();
    },
    async init() {
      this.map.setView(INITIAL_POSITION, this.zoomLevel);
      L.tileLayer(`https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${TOKEN}&fresh=0`,
      {
        maxZoom: 12,
        minZoom: 6,
        id: 'stealthmate1233/cl0gfuaya00r915lwstk0gaic',
        tileSize: 512,
        zoomOffset: -1,
        styleId: 'ja/JP',
      }).addTo(this.map);
      this.map.attributionControl.setPrefix(false);
      this.map.removeControl(this.map.zoomControl);
      // this.map.on('click', ({ latlng }) => {
      //   this.popup.setLatLng(latlng).setContent('Clicked on ' + latlng).openOn(this.map);
      // });
      let highlightPrefectures = theData.reduce((a, x) => {
        if(!a.includes(x.city)) a.push(x.city);
        return a;
      }, []);
      let x = await drawJapanOverlay(this.map);
      this.overlay = x[0];
      this.overlaySVG = x[1];
      this.nodes = x[2];
      this.nodes.forEach(node => {
        if(this.visitedPrefectures.includes(node.getAttribute('data-ken'))) node.classList.add('visited-prefecture');

        let city = `${node.getAttribute('data-ken')}-${node.getAttribute('data-sikuchoson')}`;
        if(this.visitedCities.includes(city)) node.classList.add('visited-city');
      })
      this.map.on('zoomend', (e) => {
        this.zoomLevel = e.target._zoom;
      });
      this.pois = theData.map(loc => {
        let pin = poiPin();
        let overlay = L.svgOverlay(pin, this.pinBounds(loc.location, 13 - this.zoomLevel), { interactive: true, className: 'poi' }).addTo(this.map).bindPopup(loc.place);
        return [overlay, pin, loc.location];
      });
      this.drawHighlight(this.zoomLevel);
      this.pois.forEach(x => {
        x[1].classList.add(`zoom-${this.zoomLevel}`);
      });
      this.zoomPins();
    },
  }
}
</script>

<style>
.theMap {
  width: 500px;
  height: 500px;
}
</style>

import { drawJapanOverlay, poiPin, pinBounds, poiPinRadius } from '../utils';
import theData from '../assets/data.json';
import L from 'leaflet';
export default {
  data() {
    return {
      coverageEnabled: false,
      coveragePois: [],
      coverageSlowState: undefined,
      coverageOverlay: undefined,
      coverageOverlaySVG: undefined,
      coverageSmoothTimeout: undefined,
    }
  },
  computed: {
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
  methods: {
    async coverageInit(map) {
      let {overlay, svg, nodes} = await drawJapanOverlay(map);
      this.coverageOverlay = overlay;
      this.coverageOverlaySVG = svg;
      this.coverageNodes = nodes;
      this.coverageNodes.forEach(node => {
        if(this.visitedPrefectures.includes(node.getAttribute('data-ken'))) node.classList.add('visited-prefecture');

        let city = `${node.getAttribute('data-ken')}-${node.getAttribute('data-sikuchoson')}`;
        if(this.visitedCities.includes(city)) node.classList.add('visited-city');
      })
      this.coveragePois = theData.map(loc => {
        let pin = poiPin();
        let overlay = L.svgOverlay(
          pin,
          pinBounds(loc.location, 13 - this.zoomLevel),
          { interactive: true, className: 'poi' }
        ).addTo(map).bindPopup(loc.place);
        return {overlay, pin, location: loc.location};
      });
      this.coverageHideAll();
    },

    coverageHideAll() {
      this.coverageOverlaySVG.classList.add('hidden');
      this.coveragePois.forEach(poi => poi.pin.classList.add('hidden'));
    },
    coverageShowAll() {
      this.coverageOverlaySVG.classList.remove('hidden');
      this.coveragePois.forEach(poi => poi.pin.classList.remove('hidden'));
    },
    dehighlight() {
      this.coverageOverlaySVG.classList.remove('highlight-prefecture');
      this.coverageOverlaySVG.classList.remove('highlight-city');
      this.coverageOverlaySVG.classList.remove('slow-highlight');
      this.coveragePois.forEach(x => x.pin.classList.remove('slow-highlight'));
      this.coveragePois.forEach(x => x.pin.classList.remove('highlight'));
    },
    highlightPrefectures() {
      this.coverageOverlaySVG.classList.add('highlight-prefecture');
    },
    highlightCities() {
      this.coverageOverlaySVG.classList.add('highlight-city');
    },
    resetSlowState() {
      this.coverageSlowState = 2;
    },
    incrementSlowState() {
      this.coverageSlowState = (this.coverageSlowState + 1) % 3;
    },
    smoothHighlight(zoomLevel) {
      if(zoomLevel > 6) return;
      this.dehighlight();
      this.coverageOverlaySVG.classList.add('slow-highlight');
      this.coveragePois.forEach(x => x.pin.classList.add('slow-highlight'));
      if(this.coverageSlowState === undefined) this.resetSlowState();
      switch(this.coverageSlowState) {
        case 2: this.coverageOverlaySVG.classList.add('highlight-prefecture'); break;
        case 0: this.coverageOverlaySVG.classList.add('highlight-city'); break;
        case 1: this.coveragePois.forEach(poi => poi.pin.classList.add('highlight')); break;
      }
      this.incrementSlowState();
      this.coverageSmoothTimeout = setTimeout(this.smoothHighlight, 5000, zoomLevel); 
    },
    drawHighlight(zoomLevel) {
      this.dehighlight();
      if(zoomLevel == 6) {
        this.resetSlowState();
        this.smoothHighlight();
      }
      else if(zoomLevel < 8) this.highlightPrefectures();
      else if(zoomLevel < 9) this.highlightCities();
    },
    coverageUpdate(zoomLevel) {
      clearTimeout(this.coverageSmoothTimeout);
      this.coverageSmoothTimeout = undefined;
      if(!this.coverageEnabled) {
        this.coverageHideAll();
        return;
      }
      this.coverageShowAll();

      this.coveragePois.forEach(poi => {
        poi.pin.dataset.zoom = zoomLevel;
        let bounds = pinBounds(poi.location, poiPinRadius(zoomLevel));
        poi.overlay.setBounds(bounds);
      });
      this.drawHighlight(zoomLevel);
    }
  }
}
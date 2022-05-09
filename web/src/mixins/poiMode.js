import theData from '../assets/poi.json';

import { poiPin, pinBounds } from '../utils';
import L from 'leaflet';

export const iconPin = (icon) => {
  let svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svgElement.setAttribute('xmlns', "http://www.w3.org/2000/svg");
  svgElement.setAttribute('viewBox', "-80 -80 160 160");
  svgElement.innerHTML = `
  <g class="icon-pin">
    <rect x="-64" y="-64" width="128" height="128" filter="url(#${icon})" />
  </g>
  `;
  return svgElement;
}
export const poiPinRadius = (zoomLevel) => {
  return 300 / Math.pow(1.65, zoomLevel);
}

export default {
  data() {
    return {
      poiModePoints: []
    }
  },
  methods: {
    poiModeInit(map) {
      this.poiModePoints = theData.map(poi => {
        let icon = undefined;
        switch(poi.category) {
          case 'Castle': icon = 'castle'; break;
          case 'Pond': icon = 'pond'; break;
          case 'Lake': icon = 'lake'; break;
          default: {}
        }

        let pin = undefined;
        let overlay = undefined;
        if(icon) {
          pin = iconPin(icon);
          let bounds = pinBounds(poi.location, 10000);
          overlay = L.svgOverlay(
            pin,
            bounds,
            { interactive: true, className: 'poiModePOI' }
          ).addTo(map).bindPopup(poi.place);
        } else {
          pin = poiPin();
          overlay = L.svgOverlay(
            pin,
            pinBounds(poi.location, 6),
            { interactive: true, className: 'poiModePOI' }
          ).addTo(map).bindPopup(poi.place);;
        }
        pin.dataset.category = poi.category;
        return {overlay, pin, location: poi.location};
      });
      this.poiModHideAll();
    },
    poiModHideAll() {
      this.poiModePoints.forEach(poi => {
        poi.pin.classList.add('hidden');
      })
    },
    poiModeUpdate(zoomLevel) {
      this.poiModePoints.forEach(poi => {
        poi.pin.dataset.zoom = zoomLevel;
        poi.overlay.setBounds(pinBounds(poi.location, poiPinRadius(zoomLevel)));
      });
    }
  }
}
import { fetchCityOverlay } from './api';
import { geoOffset } from './geoutils';
import { svgOverlay, latLngBounds, circle } from 'leaflet';

export const svgFromString = (str) => {
  let svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svgElement.setAttribute('xmlns', "http://www.w3.org/2000/svg");
  svgElement.innerHTML = str;
  return svgElement.childNodes[2];
}

const JP_BOUNDS = [
  [24.0456 + 0.036 - 0.077, 122.934 + 0.038 - 0.077],
  [45.5572 + 0.036, 153.987 + 0.038]
];

export const drawJapanOverlay = async (map) => {
  let svgStr = await fetchCityOverlay();
  let svg = svgFromString(svgStr);
  let bounds = latLngBounds(JP_BOUNDS[0], JP_BOUNDS[1]);
  let overlay = svgOverlay(
    svg,
    bounds
  ).addTo(map);
  svg.childNodes[1].classList.add('jp-overlay');
  let nodes = Array.from(svg.childNodes[1].getElementsByTagName('path'))
  return [overlay, svg, nodes];
}

export const poiPin = () => {
  let svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svgElement.setAttribute('xmlns', "http://www.w3.org/2000/svg");
  svgElement.setAttribute('viewBox', "0 0 200 200");
  svgElement.innerHTML = `
  <svg
class="pulsating-pin"
viewBox="-100 -100 200 200" xmlns="http://www.w3.org/2000/svg"
xmlns:xlink="http://www.w3.org/1999/xlink"
>
<filter id="blurMe" x="-50%" y="-50%" width="500%" height="500%" >
  <feGaussianBlur stdDeviation="17" />
</filter>
<circle cx="0" cy="0" r="70" filter="url(#blurMe)">
  <animate attributeName="r" begin="0s" dur="2s" repeatCount="indefinite" values="50;70;50"/>
</circle>
</svg>
  `;
  return svgElement;
}
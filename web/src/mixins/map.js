const INITIAL_POSITION = [39.370157 - 1.5, 137.680664];
// const INITIAL_POSITION = [36.575835, 138.479919];
const INITIAL_ZOOM = 6;
const TOKEN = 'pk.eyJ1Ijoic3RlYWx0aG1hdGUxMjMzIiwiYSI6ImNsMGZkM2l1bzBwcnAzbG12dzNwM3h5dmwifQ.xVloGCoapFY45tn3bMZfZg';

export default {
  data() {
    return {
      zoomLevel: INITIAL_ZOOM,
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
  },
  methods: {
    async initMap() {
      this.map.setView(INITIAL_POSITION, this.zoomLevel);
      L.tileLayer(`https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${TOKEN}&fresh=0`,
      {
        maxZoom: 15,
        minZoom: 6,
        id: 'stealthmate1233/cl0gfuaya00r915lwstk0gaic',
        tileSize: 512,
        zoomOffset: -1,
        styleId: 'ja/JP',
      }).addTo(this.map);
      this.map.attributionControl.setPrefix(false);
      this.map.removeControl(this.map.zoomControl);
    },
  }
}
import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'

import { LMap, LPopup, LMarker, LPolygon } from 'vue2-leaflet';
import 'leaflet/dist/leaflet.css';
import './assets/index.css';

Vue.component('l-map', LMap);
Vue.component('l-popup', LPopup);
Vue.component('l-marker', LMarker);
Vue.component('l-polygon', LPolygon);

Vue.config.productionTip = false;

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')

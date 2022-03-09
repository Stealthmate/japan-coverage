import axios from 'axios';

export const fetchCityOverlay = async () => {
  let response = await axios.get('/overlays/japan.svg/');
  return response.data;
};
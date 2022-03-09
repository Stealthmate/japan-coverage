export const R_EARTH = '6378.1';

export const geoOffset = (lat, lon, b, d) => {
  let lat_rad = Math.PI * lat / 180.0;
  let lon_rad = Math.PI * lon / 180.0;
  let b_rad = b * Math.PI / 180.0;
  let lat2 = Math.asin(
    Math.sin(lat_rad) * Math.cos(d/R_EARTH)
    + Math.cos(lat_rad) * Math.sin(d/R_EARTH) * Math.cos(b_rad)
  );
  let lon2 = lon_rad + Math.atan2(
    Math.sin(b_rad) * Math.sin(d/R_EARTH) * Math.cos(lat_rad),
    Math.cos(d/R_EARTH) - Math.sin(lat_rad) * Math.sin(lat2)
  );
  return [lat2 * 180.0 / Math.PI, lon2 * 180.0 / Math.PI];
};
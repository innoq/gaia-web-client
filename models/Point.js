export default class Point {
  constructor(longitude, latitude) {
    this.longitude = longitude;
    this.latitude = latitude;
    this.polygon = null;
  }

  belongsTo(polygon) {
    this.polygon = polygon;
  }
}

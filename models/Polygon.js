import { toLonLat } from "ol/proj";

import Point from "./Point";

export default class Polygon {
  constructor(feature) {
    this.points = [];
    this.feature = feature;
    feature
      .getGeometry()
      .getCoordinates()[0]
      .forEach(p => {
        const coordinates = toLonLat([p[0], p[1]]);
        const point = new Point(coordinates[0], coordinates[1]);
        this.points.push(point);
        point.belongsTo(this);
      });
  }
}

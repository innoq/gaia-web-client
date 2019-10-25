import "ol/ol.css";
import { toLonLat } from "ol/proj";

import OlMap from "./OlMap";
import Point from "./models/Point";
import Polygon from "./models/Polygon";

let points = [];

const olMap = new OlMap();

const button = document.querySelector("#addCoord");

button.addEventListener("click", e => {
  const currentPosition = olMap.geolocation.getPosition();
  const currentPositionLonLat = toLonLat([
    currentPosition[0],
    currentPosition[1]
  ]);
  const point = new Point(currentPositionLonLat[0], currentPositionLonLat[1]);
  points.push(point);
  renderPointList();
  olMap.onChangeGeolocation();
});

const renderPointList = function() {
  const pointList = document.querySelector(".point-list");
  pointList.innerHTML = "";
  console.log({ points });
  points.forEach(p => {
    const li = document.createElement("li");
    li.innerHTML = `lon: ${p.longitude} lat: ${p.latitude}`;
    pointList.appendChild(li);
  });
};

olMap.source.on("addfeature", vectorSourceEvent => {
  const polygon = new Polygon(vectorSourceEvent.feature);
  points = points.concat(polygon.points);
  renderPointList();
});

import "ol/ol.css";
import { Map, View } from "ol";
import { fromLonLat } from "ol/proj";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";

let currentPosition = [0, 0];
let polygonPoints = [];

const map = new Map({
  target: "map",
  layers: [
    new TileLayer({
      source: new OSM()
    })
  ],
  view: new View({
    center: currentPosition,
    zoom: 5
  })
});

if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition(position => {
    currentPosition = fromLonLat([
      position.coords.longitude,
      position.coords.latitude
    ]);
    map.getView().animate({ center: currentPosition, zoom: 16, duration: 100 });
    console.log("updated currentPosition: " + currentPosition);
  });

  const button = document.querySelector("#addCoord");

  button.addEventListener('click', (e) => {
    navigator.geolocation.getCurrentPosition(function(position) {
      // console.log("position:", position);
      addNewPolygonPoint(position.coords.latitude, position.coords.longitude);
    });
  });
}



const addNewPolygonPoint = function(lon, lat) {
  const point = [lon, lat];
  polygonPoints.push(point);
  // for (var pos of polygonPoints) {
  //   console.log("pos:", pos);
  // }
}

console.log(">>>>><currentPosition: " + currentPosition);

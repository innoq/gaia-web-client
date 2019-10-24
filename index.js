import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import { fromLonLat } from "ol/proj";
import { Draw, Modify, Snap } from "ol/interaction";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
import { OSM, Vector as VectorSource } from "ol/source";
import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style";

let currentPosition = [0, 0];
let polygonPoints = [];

const raster = new TileLayer({
  source: new OSM()
});

const source = new VectorSource();
const vector = new VectorLayer({
  source: source,
  style: new Style({
    fill: new Fill({
      color: "rgba(255, 255, 255, 0.2)"
    }),
    stroke: new Stroke({
      color: "#ff0000",
      width: 2
    }),
    image: new CircleStyle({
      radius: 7,
      fill: new Fill({
        color: "#ff0000"
      })
    })
  })
});

var map = new Map({
  layers: [raster, vector],
  target: "map",
  view: new View({
    center: [-11000000, 4600000],
    zoom: 4
  })
});

var modify = new Modify({ source: source });
map.addInteraction(modify);

var draw, snap; // global so we can remove them later

draw = new Draw({
  source: source,
  type: "Polygon"
});
map.addInteraction(draw);
snap = new Snap({ source: source });
map.addInteraction(snap);

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

  button.addEventListener("click", e => {
    navigator.geolocation.getCurrentPosition(function(position) {
      // console.log("position:", position);
      addNewPolygonPoint(position.coords.latitude, position.coords.longitude);
    });
  });
}

const addNewPolygonPoint = function(lon, lat) {
  const point = [lon, lat];
  polygonPoints.push(point);
  console.log("_____________");
  for (var pos of polygonPoints) {
    console.log("pos:", pos);
  }
  console.log("_____________");
};

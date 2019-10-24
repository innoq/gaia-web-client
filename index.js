import "ol/ol.css";
import Feature from "ol/Feature";
import Geolocation from "ol/Geolocation";
import Map from "ol/Map";
import Point from "ol/geom/Point";
import View from "ol/View";
import { fromLonLat, toLonLat } from "ol/proj";
import { Draw, Modify, Snap } from "ol/interaction";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
import { XYZ, Vector as VectorSource } from "ol/source";
import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style";

let currentPosition = [0, 0];
let polygonPoints = [];

const raster = new TileLayer({
  source: new XYZ({
    attributions: [
      "Powered by Esri",
      "Source: Esri, DigitalGlobe, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN, and the GIS User Community"
    ],
    attributionsCollapsible: false,
    url:
      "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    maxZoom: 23
  })
});

var positionFeature = new Feature();
positionFeature.setStyle(
  new Style({
    image: new CircleStyle({
      radius: 6,
      fill: new Fill({
        color: "#3399CC"
      }),
      stroke: new Stroke({
        color: "#fff",
        width: 2
      })
    })
  })
);

const accuracyFeature = new Feature();

const source = new VectorSource({
  features: [positionFeature, accuracyFeature]
});

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

const view = new View({
  center: [-11000000, 4600000],
  zoom: 4
});

var map = new Map({
  layers: [raster, vector],
  target: "map",
  view: view
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

var geolocation = new Geolocation({
  // enableHighAccuracy must be set to true to have the heading value.
  trackingOptions: {
    enableHighAccuracy: true
  },
  projection: view.getProjection()
});

geolocation.setTracking(true);

geolocation.on("change:position", function() {
  accuracyFeature.setGeometry(geolocation.getAccuracyGeometry());
  var coordinates = geolocation.getPosition();
  positionFeature.setGeometry(coordinates ? new Point(coordinates) : null);
  map.getView().animate({ center: coordinates, zoom: 16, duration: 100 });
});

// navigator.geolocation.getCurrentPosition(
//   position => {
//     currentPosition = fromLonLat([
//       position.coords.longitude,
//       position.coords.latitude
//     ]);
//     positionFeature.setGeometry(new Point(currentPosition));
//     map.getView().animate({ center: currentPosition, zoom: 16, duration: 100 });
//     console.log("updated currentPosition: " + currentPosition);
//   },
//   err => null,
//   { enableHighAccuracy: true }
// );

const button = document.querySelector("#addCoord");

button.addEventListener("click", e => {
  console.log("button clicked");
  geolocation.getCurrentPosition(function(position) {
    console.log("position:", position);
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    addNewPolygonPoint(lon, lat);
    // renderNewPolygonPoint(lon, lat);
    renderPointList();
  });
});

const addNewPolygonPoint = function(lon, lat) {
  const point = [lon, lat];
  polygonPoints.push(point);
};

const renderNewPolygonPoint = function(lon, lat) {
  // const pointList = document.querySelector(".point-list");
  // for (var polygonPoint of polygonPoints) {
  //   const lon = polygonPoint[0];
  //   const lat = polygonPoint[1];
  //   var point = new OpenLayers.Feature.Vector(
  //     new OpenLayers.Geometry.Point(-111.04, 45.68)
  //   );
  //   console.log("point:", point);
  // }
};

const renderPointList = function() {
  const pointList = document.querySelector(".point-list");
  pointList.innerHTML = "";
  console.log({ polygonPoints });
  for (var polygonPoint of polygonPoints) {
    const li = document.createElement("li");
    li.innerHTML = `lon: ${polygonPoint[0]} lat: ${polygonPoint[1]}`;
    pointList.appendChild(li);
  }
};

source.on("addfeature", vectorSourceEvent => {
  const polygonPoints = vectorSourceEvent.feature
    .getGeometry()
    .getCoordinates()[0];
  for (let i = 0; i < polygonPoints.length; i++) {
    const coord = toLonLat([polygonPoints[i][0], polygonPoints[i][1]]);
    addNewPolygonPoint(coord[0], coord[1]);
  }
});

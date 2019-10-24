import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import { fromLonLat } from "ol/proj";
import { Draw, Modify, Snap } from "ol/interaction";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
import { XYZ, Vector as VectorSource } from "ol/source";
import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style";

let currentPosition = [0, 0];
let polygonPoints = [];

const raster = new TileLayer({
  source: new XYZ({
    attributions: ['Powered by Esri',
                   'Source: Esri, DigitalGlobe, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN, and the GIS User Community'],
    attributionsCollapsible: false,
    url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    maxZoom: 23
  })
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
    console.log("button clicked");
    navigator.geolocation.getCurrentPosition(function(position) {
      console.log("position:", position);
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      addNewPolygonPoint(lon, lat);
      // renderNewPolygonPoint(lon, lat);
      renderPointList();
    });
  });
}

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

const renderPointList = function () {
  const pointList = document.querySelector(".point-list");
  pointList.innerHTML = '';
  console.log({polygonPoints});
  for (var polygonPoint of polygonPoints) {
    const li = document.createElement('li');
    li.innerHTML = `lon: ${polygonPoint[0]} lat: ${polygonPoint[1]}`;
    pointList.appendChild(li);
  }

}


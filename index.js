import "ol/ol.css";
import { toLonLat } from "ol/proj";

import Polygon from "./models/Polygon";


import Feature from "ol/Feature";
import Geolocation from "ol/Geolocation";
import GeoJSON from 'ol/format/GeoJSON';
import Map from "ol/Map";
import Point from "ol/geom/Point";
import View from "ol/View";
import { Draw, Modify, Snap } from "ol/interaction";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
import { XYZ, Vector as VectorSource } from "ol/source";
import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style";

let points = [];

var accuracyFeature = new Feature();

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

var raster = new TileLayer({
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

var source = new VectorSource();
var vector = new VectorLayer({
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

var view = new View({
  center: [-11000000, 4600000],
  zoom: 4
});

var geolocation = new Geolocation({
    // enableHighAccuracy must be set to true to have the heading value.
    trackingOptions: {
      enableHighAccuracy: true
    },
    projection: view.getProjection(),
    tracking: true,
});

var map = new Map({
  layers: [raster, vector],
  target: "map",
  view: view
});

var modify = new Modify({ source: source });

var draw = new Draw({
  source: source,
  type: "Polygon"
});

var snap = new Snap({ source: source });

map.addInteraction(modify);
map.addInteraction(draw);
map.addInteraction(snap);



geolocation.on("change:position", evt => {
	accuracyFeature.setGeometry(geolocation.getAccuracyGeometry());
});

geolocation.on('change:accuracyGeometry', evt => {
	const currentPosition = geolocation.getPosition();
	const currentPositionLonLat = toLonLat([
		currentPosition[0],
		currentPosition[1]
		]);
	console.log("new current position: " + currentPositionLonLat);
	
	//this.accuracyFeature.setGeometry(this.geolocation.getAccuracyGeometry());
	const coordinates = geolocation.getPosition();
	positionFeature.setGeometry(new Point(coordinates));
	map
	.getView()
	.animate({ center: coordinates, zoom: 16, duration: 100 });
});

new VectorLayer({
	map: map,
	source: new VectorSource({
	  features: [accuracyFeature, positionFeature]
    })
});



const button = document.querySelector("#addCoord");

button.addEventListener("click", e => {
  const currentPosition = geolocation.getPosition();
  const currentPositionLonLat = toLonLat([
    currentPosition[0],
    currentPosition[1]
  ]);
  const point = new Point(currentPositionLonLat[0], currentPositionLonLat[1]);
  points.push(point);
  renderPointList();
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

let polygonFeature;
source.on("addfeature", vectorSourceEvent => {
  map.removeInteraction(draw);
  const polygon = new Polygon(vectorSourceEvent.feature);
  polygonFeature = vectorSourceEvent.feature;
  points = points.concat(polygon.points);
  renderPointList();
});


const getSelectedCrop = function() {
  const crop = document.querySelector("#crop-selection");
  return crop.value;
}

const postNewArea = function () {
  console.log({polygonFeature});
  if (polygonFeature) {
    // const crop = getSelectedCrop();

    polygonFeature.set('cropName', getSelectedCrop());
    console.log("polygonFeature", polygonFeature);
    const geometry = polygonFeature.getGeometry();
    console.log("geometry", geometry);
    const geoJSON = new GeoJSON();
    const json = geoJSON.writeFeature(polygonFeature);

    console.log(json);
  }
}

const postButton = document.querySelector('#postField');
postButton.addEventListener('click', e => {
  postNewArea();
});

import "ol/ol.css";
import Feature from "ol/Feature";
import Geolocation from "ol/Geolocation";
import { Draw, Modify, Snap } from "ol/interaction";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
import Map from "ol/Map";
import Point from "ol/geom/Point";
import { toLonLat } from "ol/proj";
import { XYZ, Vector as VectorSource } from "ol/source";
import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style";
import View from "ol/View";

const accuracyFeature = new Feature();
const positionFeature = new Feature();
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

const view = new View({
  center: [-11000000, 4600000],
  zoom: 4
});

const geolocation = new Geolocation({
  // enableHighAccuracy must be set to true to have the heading value.
  trackingOptions: {
    enableHighAccuracy: true
  },
  projection: view.getProjection(),
  tracking: true
});

const map = new Map({
  layers: [raster, vector],
  target: "map",
  view: view
});

const modify = new Modify({ source: source });

const draw = new Draw({
  source: source,
  type: "Polygon"
});

const snap = new Snap({ source: source });

map.addInteraction(modify);
map.addInteraction(draw);
map.addInteraction(snap);

geolocation.on("change:position", evt => {
  accuracyFeature.setGeometry(geolocation.getAccuracyGeometry());
});

geolocation.on("change:accuracyGeometry", evt => {
  const currentPosition = geolocation.getPosition();
  const currentPositionLonLat = toLonLat([
    currentPosition[0],
    currentPosition[1]
  ]);
  console.log("new current position: " + currentPositionLonLat);

  const coordinates = geolocation.getPosition();
  positionFeature.setGeometry(new Point(coordinates));
  map.getView().animate({ center: coordinates, zoom: 16, duration: 100 });
});

let polygonFeature;
source.on("addfeature", vectorSourceEvent => {
  map.removeInteraction(draw);
  polygonFeature = vectorSourceEvent.feature;
});

new VectorLayer({
  map: map,
  source: new VectorSource({
    features: [accuracyFeature, positionFeature]
  })
});

exports.getPolygonFeature = () => polygonFeature;

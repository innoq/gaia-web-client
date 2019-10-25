import Feature from "ol/Feature";
import Geolocation from "ol/Geolocation";
import Map from "ol/Map";
import Point from "ol/geom/Point";
import View from "ol/View";
import { toLonLat } from "ol/proj";
import { Draw, Modify, Snap } from "ol/interaction";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
import { XYZ, Vector as VectorSource } from "ol/source";
import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style";
export default class OlMap {
  constructor() {
    this.accuracyFeature = new Feature();

    this.positionFeature = new Feature();
    this.positionFeature.setStyle(
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
    this.raster = new TileLayer({
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
    this.source = new VectorSource({
      features: [this.positionFeature, this.accuracyFeature]
    });

    this.vector = new VectorLayer({
      source: this.source,
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

    this.view = new View({
      center: [-11000000, 4600000],
      zoom: 4
    });

    this.map = new Map({
      layers: [this.raster, this.vector],
      target: "map",
      view: this.view
    });

    this.modify = new Modify({ source: this.source });

    this.draw = new Draw({
      source: this.source,
      type: "Polygon"
    });
    this.snap = new Snap({ source: this.source });

    this.map.addInteraction(this.modify);
    this.map.addInteraction(this.draw);
    this.map.addInteraction(this.snap);

    this.geolocation = new Geolocation({
      // enableHighAccuracy must be set to true to have the heading value.
      trackingOptions: {
        enableHighAccuracy: true
      },
      projection: this.view.getProjection()
    });
    this.geolocation.setTracking(true);
    this.geolocation.on("change:position", this.onChangeGeolocation);
  }

  onChangeGeolocation() {
    if (!this.geolocation) {
      return;
    }
    const currentPosition = this.geolocation.getPosition();
    const currentPositionLonLat = toLonLat([
      currentPosition[0],
      currentPosition[1]
    ]);
    console.log("new current position: " + currentPositionLonLat);

    this.accuracyFeature.setGeometry(this.geolocation.getAccuracyGeometry());
    const coordinates = this.geolocation.getPosition();
    this.positionFeature.setGeometry(new Point(coordinates));
    this.map
      .getView()
      .animate({ center: coordinates, zoom: 16, duration: 100 });
  }
}

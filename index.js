import GeoJSON from "ol/format/GeoJSON";
import { getPolygonFeature } from "./openlayers";

const confirmationMessage = function(selectedCrop) {
  const confirmationMessage = document.querySelector(".confirmation");
  confirmationMessage.innerHTML = `${selectedCrop} field data has been sent to server`;
};

const getSelectedCrop = function() {
  const crop = document.querySelector("#crop-selection");
  return crop.value;
};

const sendNewAreaToServer = function() {
  const polygonFeature = getPolygonFeature();
  console.log({ polygonFeature });
  if (polygonFeature) {
    polygonFeature.set("cropName", getSelectedCrop());
    console.log("polygonFeature", polygonFeature);
    const geometry = polygonFeature.getGeometry();
    console.log("geometry", geometry);
    const geoJSON = new GeoJSON();
    const json = geoJSON.writeFeature(polygonFeature);

    console.log(json);
    confirmationMessage(getSelectedCrop());
  }
};

const postButton = document.querySelector("#postField");
postButton.addEventListener("click", e => {
  sendNewAreaToServer();
});

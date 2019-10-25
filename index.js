import GeoJSON from "ol/format/GeoJSON";
import { getPolygonFeature } from "./openlayers";
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";

const uuidv1 = require('uuid/v1');

const firebaseConfig = {
  apiKey: "AIzaSyCELnZecj1XpxCdaW7-wOLy5GDapL0-ETg",
  authDomain: "gaia-ce696.firebaseapp.com",
  databaseURL: "https://gaia-ce696.firebaseio.com",
  projectId: "gaia-ce696",
  storageBucket: "gaia-ce696.appspot.com",
  messagingSenderId: "808239744138",
  appId: "1:808239744138:web:6d7f680d4e537f87b31973"
};

firebase.initializeApp(firebaseConfig);

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

    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      const fieldId = uuidv1();
      console.log(`uuid: ${fieldId}`);
      firebase.database().ref(`users/${user.uid}/fields/${fieldId}`).set(json);
      confirmationMessage(getSelectedCrop());
    } else {
      console.error("no user");
    }

  }
};

const postButton = document.querySelector("#postField");
postButton.addEventListener("click", e => {
  sendNewAreaToServer();
});

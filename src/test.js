function test() {
  let link2google = "https://www.google.com/maps/";
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      position => {
        link2google += `@${position.coords.latitude},${position.coords.longitude}/data=!4m8!1m2!3m1!2sGaia!3m4!1s0x47bf26781beac97d:0xbe043af11b3c3732!8m2!3d50.9383615!4d6.9970357`;
        console.log(
          "position: " +
            position.coords.latitude +
            "-" +
            position.coords.longitude
        );
      },
      error => {
        console.error(`BOOM: ${error.message}`);
      }
    );
    console.log("haben wir");
  } else {
    console.log("nö");
  }

  console.log("in test" + link2google);
  //   document.getElementById("link2google").href = link2google;
}

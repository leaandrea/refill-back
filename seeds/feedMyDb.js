const shittyData = require("./fontaines-a-boire.json");
// console.log(shittyData);
const fontaines = [];

function filterData() {
  for (const element of shittyData) {
    const newObject = {};
    newObject.lat = element.fields.geo_shape.coordinates[1];
    newObject.lng = element.fields.geo_shape.coordinates[0];
    newObject.potable = element.fields.a_boire;
    newObject.address = element.fields.adr_s;
    newObject.gazeuse =
      element.fields.modele === "Fontaine pétillante" ? true : false;
    newObject.verified = true;
    newObject.type = "fontaine";
    if (element.fields.en_service) {
      newObject.en_service =
        element.fields.en_service[0] === "N" ? false : true;
    } else {
      newObject.en_service = true;
    }
    fontaines.push(newObject);
  }
  return fontaines;
}

filterData();

const fontaineModel = require("../models/Fontaine");
const mongoose = require("mongoose");

// mongoose
//   .connect("mongodb://localhost/refill", { useNewUrlParser: true })
//   .then(() => {
//     fontaineModel
//       .insertMany(fontaines)
//       .then(res => {
//         console.log(res);
//         console.log("youuupi feed");
//       })
//       .catch(err => console.log(err));
//     // fontaineModel.find({ en_service: "Non" }).then(res => console.log(res));
//   });

module.exports = filterData;

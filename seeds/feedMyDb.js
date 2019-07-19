const shittyData = require("./fontaines-a-boire.json");
console.log(shittyData);
const fontaines = [];

for (const element of shittyData) {
  const newObject = {};
  newObject.lat = element.fields.geo_shape.coordinates[1];
  newObject.lng = element.fields.geo_shape.coordinates[0];
  newObject.potable = element.fields.a_boire;
  newObject.address = element.fields.adr_s;
  console.log(element.fields.en_service);
  if (element.fields.en_service) {
    newObject.en_service = element.fields.en_service[0] === "N" ? false : true;
  } else {
    newObject.en_service = true;
  }
  // newObject.en_service =;
  fontaines.push(newObject);
}
// console.log(fontaines);

const fontaineModel = require("../models/Fontaine");
const mongoose = require("mongoose");

// mongoose
//   .connect("mongodb://localhost/refill", { useNewUrlParser: true })
//   .then(() => {
//     fontaineModel
//       .insertMany(fontaines)
//       .then(res => {
//         console.log("youuupi");
//       })
//       .catch(err => console.log(err));
//     // fontaineModel.find({ en_service: "Non" }).then(res => console.log(res));
//   });

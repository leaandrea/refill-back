const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const InitialPoint = new Schema({
  name: String,
  lat: Number,
  lng: Number
});

module.exports = mongoose.model("initialPoint", InitialPoint);

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Fontaine = new Schema({
  lat: Number,
  lng: Number,
  potable: { type: Number, enum: [0, 1] },
  address: String,
  en_service: { type: Boolean }
});

module.exports = mongoose.model("fontaine", Fontaine);

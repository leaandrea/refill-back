const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const fontaineSchema = new Schema({
  name: String,
  longitude: String,
  latitude: String,
  onService: String,
  adresse: String
});

const User = mongoose.model("User", userSchema);
module.exports = User;

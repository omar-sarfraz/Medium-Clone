const mongoose = require("mongoose");

let modelSchema = mongoose.Schema({
  name: String,
  email: String,
  password: String,
  profile_img: String,
  role: [],
});

let Model = mongoose.model("User", modelSchema);
module.exports = Model;

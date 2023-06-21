const mongoose = require("mongoose");

let modelSchema = mongoose.Schema({
  name: String,
});

let Model = mongoose.model("Category", modelSchema);
module.exports = Model;

const mongoose = require("mongoose");

let modelSchema = mongoose.Schema({
  title: String,
  owner_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  cover_img: String,
  article: String,
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
  date: { type: String, default: new Date() },
});

let Model = mongoose.model("Article", modelSchema);
module.exports = Model;

const express = require("express");
const Category = require("../models/Category");
const sessionAuth = require("../middlewares/sessionAuth");
const adminAuth = require("../middlewares/adminAuth");

let router = express.Router();

router.get("/admin-panel", sessionAuth, adminAuth, async (req, res) => {
  let records = await Category.find();

  res.render("admin-panel", { categories: records });
});

module.exports = router;

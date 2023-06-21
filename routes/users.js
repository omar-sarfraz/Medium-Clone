const express = require("express");
const User = require("../models/User");

const multer = require("multer");
const fs = require("fs");
const upload = multer({ dest: "uploads/" });

const sessionAuth = require("../middlewares/sessionAuth");

let router = express.Router();

router.post("/user/updateuser/:id", sessionAuth, upload.single("image"), async function (req, res) {
  // console.log(req.params.id);
  let existingRecord = await User.findById(req.params.id);

  let userObj = req.body;

  // console.log(req.file, userObj);
  if (req.file) {
    let image = fs.readFileSync(req.file.path, "base64");
    // Deleting the file from FileSystem
    fs.rmSync(req.file.path);
    userObj.profile_img = image;
  }

  let record = await User.findByIdAndUpdate(req.params.id, userObj, {
    new: true,
  });

  let isEqual = record.name === existingRecord.name && record.profile_img === existingRecord.profile_img;

  if (!isEqual) {
    req.session.user = record;
    req.setFlash("Success", "Profile Updated Successfully");
    res.redirect("back");
  } else {
    res.redirect("back");
  }
});

module.exports = router;

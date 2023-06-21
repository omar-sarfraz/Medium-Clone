const express = require("express");
const bcrypt = require("bcryptjs");
let router = express.Router();
let User = require("../models/User");
let Article = require("../models/Article");

let sessionAuth = require("../middlewares/sessionAuth");
let admin = require("../middlewares/adminAuth");

const multer = require("multer");
const fs = require("fs");
const upload = multer({ dest: "uploads/" });

router.get("/login", (req, res) => {
  res.render("auth/login");
});

router.get("/logout", (req, res) => {
  req.session.user = null;
  req.setFlash("Success", "Logged out!");
  req.session.flash = { type: "Success", message: "Logged Out Successfully!" };
  res.redirect("/login");
});

router.post("/login", async (req, res) => {
  let user = await User.findOne({ email: req.body.email });
  if (!user) {
    req.setFlash("Error", "User with this email not present");
    return res.redirect("/login");
  }
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (validPassword) {
    req.session.user = user;
    req.setFlash("Success", "Logged in Successfully");
    return res.redirect("/");
  } else {
    req.setFlash("Error", "Invalid Password");
    return res.redirect("/login");
  }
});

router.get("/register", (req, res) => {
  res.render("auth/register");
});

router.post("/register", upload.single("image"), async (req, res) => {
  //   await User.deleteMany({});

  let image = fs.readFileSync(req.file.path, "base64");

  let email = req.body.email;
  let existingUser = await User.find({ email: email });

  if (existingUser.length) {
    // console.log(existingUser);
    req.setFlash("Exist", "User Already Exist. Please Log in");
    return res.redirect("/login");
  }

  let userObj = req.body;

  userObj.profile_img = image;
  userObj.role = ["user"];

  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(userObj.password, salt);
  userObj.password = hashed;

  let user = new User(userObj);
  await user.save();

  req.session.user = user;
  req.setFlash("Success", "Registered Successfully");
  res.redirect("/");
});

router.get("/profile/:id", async (req, res) => {
  let user_id = req.params.id;
  let user = await User.findById(user_id);
  let articles = await Article.find({ owner_id: user_id }).populate("owner_id").populate("category");

  // console.log(articles);

  res.render("auth/profile", {
    articles,
    profile_id: user_id,
    full_name: user.name,
    user_profile_img: user.profile_img,
  });
});

router.get("/admin-profile", sessionAuth, admin, async (req, res, next) => {
  res.render("auth/admin-profile");
});
module.exports = router;

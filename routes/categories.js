const express = require("express");
const Category = require("../models/Category");
const Article = require("../models/Article");
const sessionAuth = require("../middlewares/sessionAuth");
const adminAuth = require("../middlewares/adminAuth");

let router = express.Router();

router.post("/categories", sessionAuth, adminAuth, async function (req, res) {
  try {
    let category = req.body;

    let record = new Category(category);
    await record.save();

    req.setFlash("Success", "Category Added Successfully");
  } catch (e) {
    req.setFlash("Error", e);
  } finally {
    res.redirect("back");
  }
});

router.post("/categories/update/:id", sessionAuth, adminAuth, async function (req, res) {
  try {
    let checkRecord = await Category.findById(req.params.id);
    if (checkRecord.name === "Other") {
      req.setFlash("Error", "Other is a generic category which cannot updated.");
    } else {
      let record = await Category.findByIdAndUpdate(req.params.id, req.body);

      if (req.body.name !== record.name) {
        req.setFlash("Success", "Category Updated Successfully");
      }
    }
  } catch (error) {
    req.setFlash("Error", error);
  } finally {
    res.redirect("back");
  }
});

router.get("/categories/delete/:id", sessionAuth, adminAuth, async function (req, res) {
  try {
    let checkRecord = await Category.findById(req.params.id);
    if (checkRecord.name === "Other") {
      req.setFlash("Error", "Other is a generic category which cannot deleted.");
    } else {
      let record = await Category.findByIdAndDelete(req.params.id);
      let deleted = await Article.deleteMany({ category: req.params.id });
      req.setFlash("Success", `Category Deleted Successfully. Along with ${deleted.deletedCount >= 0 ? "Article" : "Articles"}`);
    }
  } catch (error) {
    req.setFlash("Error", error);
  } finally {
    res.redirect("back");
  }
});

router.get("/categories/:id/:pageNo", async (req, res) => {
  let pageNo = req.params.pageNo;

  let totalRecords = await Article.find({ category: req.params.id }).count();
  let pageSize = 10;

  let totalPages = Math.ceil(totalRecords / pageSize);

  let firstPage = false;
  let lastPage = false;

  if (pageNo === 1) {
    firstPage = true;
  } else if (pageNo === totalPages) {
    lastPage = true;
  }

  let articles = await Article.find({ category: req.params.id })
    .skip((pageNo - 1) * pageSize)
    .limit(pageSize)
    .populate("owner_id")
    .populate("category");
  let categories = await Category.find({});

  res.render("articles/read", { articles, categories, firstPage, lastPage, totalPages, pageSize, currentPage: parseInt(pageNo), totalRecords });
});

module.exports = router;

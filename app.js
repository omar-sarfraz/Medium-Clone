const express = require("express");
let app = express();
let expressLayouts = require("express-ejs-layouts");
let cookieParser = require("cookie-parser");
let session = require("express-session");
let Article = require("./models/Article");
let Category = require("./models/Category");

app.set("view engine", "ejs");
app.use(express.static("public"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(expressLayouts);
app.use(cookieParser());

app.use(
  session({
    secret: "My Top Secret String",
    cookie: { maxAge: 600000 },
    resave: true,
    saveUninitialized: true,
  })
);

app.use(require("./middlewares/isAdmin"));
app.use(require("./middlewares/checkSession"));

app.get("/", async (req, res) => {
  if (req.session.user) {
    return res.redirect("/read/1");
  }

  let articles = await Article.find().populate("owner_id").populate("category").limit(10);
  let categories = await Category.find();
  // console.log(articles[0]);
  res.render("homepage", { articles, categories });
});

app.use("/", require("./routes/users"));
app.use("/", require("./routes/articles"));
app.use("/", require("./routes/auth"));
app.use("/", require("./routes/admin"));
app.use("/", require("./routes/categories"));

app.listen(3000, () => {
  console.log("Server Started on port 3000");
});

const mongoose = require("mongoose");
mongoose
  .connect("mongodb://localhost:27017/medium_clone", { useNewUrlParser: true })
  .then(() => console.log("Connected to Mongo ...."))
  .catch((error) => console.log(error.message));

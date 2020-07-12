require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();
const appRoutes = require('./routes/appRoutes')
var path = require("path");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "./views"));
app.use(bodyParser.json({
  limit: "50mb"
}));
app.use(bodyParser.urlencoded({
  limit: "50mb",
  extended: true,
  parameterLimit: 50000
}));
app.use(express.static(path.join(__dirname, "./public")));
app.use(appRoutes);
let port = process.env.PORT;

app.listen(port, function () {
  console.log("Server started on port 3000");
});
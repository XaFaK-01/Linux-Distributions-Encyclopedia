require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const superagent = require("superagent");
var _ = require("lodash");

var string = require("lodash/string");

const welcomeStartingContent =
  "Find information regarding some of the latest and greatest Linux Distributions. Join the world of Free and Open Source Software by finding the Linux Distribution that best suites for your needs.";
const aboutContent =
  "Linux Distributions are various flavors of GNU/Linux Operating System. Each Linux Distribution have its own or inherited package manager, desktop environment, release type, backed community and various tools. Through this website you can find the perfect GNU/Linux distribution for your needs.";
const app = express();
var path = require("path");
app.set("view engine", "ejs"); //by defining this line the res.render() will directly go into that folder to search for home
app.set("views", path.join(__dirname, "./views"));
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "./public")));

const url = process.env.URL
let port = process.env.PORT
let distros = [];

function updateDistrosList() {
  superagent
    .get(url)
    .then((res) => {
      distros = res.body;
    })
    .catch((err) => {
      console.log(err);
    });
}
updateDistrosList();

app.get("/", async (req, res) => {
  updateDistrosList();
  res.render("home", { welcomeStartingContent, distros });
});
app.get("/about", (req, res) => {
  res.render("about", { aboutContent });
});

app.get("/viewDistro/:distroName", (req, res) => {
  updateDistrosList();
  distros.forEach((distro) => {
    if (req.params.distroName === distro.name) {
      res.render("viewDistro", { distro });
    }
  });
});

app.post("/searchDistro", (req, res) => {
  updateDistrosList();
  const userInput = _.lowerCase(req.body.distroName);
  distros.forEach((distro) => {
    if (userInput === _.lowerCase(distro.name)) {
      res.render("viewDistro", { distro });
    }
  });
});

app.listen(port, function () {
  console.log("Server started on port 3000");
});

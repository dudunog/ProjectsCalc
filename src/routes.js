const express = require("express");
const routes = express.Router();

const viewsPath = __dirname + "/Views/";

const profile = {
  name: "Jakeline",
  avatar:
    "https://avatars.githubusercontent.com/u/17316392?s=460&u=6912a91a70bc89745a2079fdcdad3bc3ce370f13&v=4",
  "monthly-budget": 5000,
  "days-per-week": 5,
  "hours-per-day": 5,
  "vacation-per-year": 10,
};

routes.get("/", (req, res) => res.render(viewsPath + "index"));
routes.get("/job", (req, res) => res.render(viewsPath + "job"));
routes.get("/job/edit", (req, res) => res.render(viewsPath + "job-edit"));
routes.get("/profile", (req, res) =>
  res.render(viewsPath + "profile", { profile })
);

module.exports = routes;

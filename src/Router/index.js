const Route = require("express").Router();
const User = require("./User");

Route.get("/", (req, res) => {
  res.send("Hi i Evaldo Vega, welcome to API trainner");
});

Route.use("/", (req, res, next) => {
  res.setHeader("Content-Type", "application/json");
  next();
});
Route.use("/users", User);

module.exports = Route;

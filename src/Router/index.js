const Route = require("express").Router();
const User = require("./User");

Route.get("/", (req, res) => {
  res.send("Hi i Evaldo Vega, welcome to API trainner");
});

Route.use("/", (req, res, next) => {
  res.setHeader("Content-Type", "application/json");
  global.elasticClient
    .index({
      index: "logs",
      body: {
        url: req.url,
        method: req.method,
      },
    })
    .then((res) => {
      console.log("Logs indexed");
    })
    .catch((err) => {
      console.log(err);
    });
  next();
});

Route.use("/users", User);

module.exports = Route;

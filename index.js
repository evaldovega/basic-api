const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connect = require("./src/db");
const app = express();

// create application/x-www-form-urlencoded parser
/*
app.use(
  bodyParser.urlencoded({
    extended: true,
    limit: "100mb",
    parameterLimit: 100000,
  })
);*/
app.use(bodyParser.json());

app.use(cors({}));

const Routers = require("./src/Router");
app.use("/api/v1", Routers);

app.use(express.static("build"));

(async () => {
  try {
    await connect();
    console.log("DB ready");
    app.listen(3000, () => {
      console.log("Server http ready");
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
})();

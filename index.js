const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const elastic = require("elasticsearch");
const bodyParser = require("body-parser");
const connect = require("./src/db");
const app = express();

// create application/x-www-form-urlencoded parser
app.use(
  bodyParser.urlencoded({
    extended: true,
    limit: "100mb",
    parameterLimit: 100000,
  })
);
app.use(bodyParser.json());

app.use(cors({}));

const Routers = require("./src/Router");
app.use("/api/v1", Routers);

app.use(express.static("build"));

(async () => {
  try {
    await connect();
    console.log("DB ready");
    global.elasticClient = new elastic.Client({
      host: "elasticsearch:9200",
    });
    console.log("Elasticsearch ready");
    global.elasticClient.ping(
      {
        // ping usually has a 3000ms timeout
        requestTimeout: 1000,
      },
      function (error) {
        if (error) {
          console.trace("elasticsearch cluster is down!");
        } else {
          console.log("All is well");
        }
      }
    );

    app.listen(3000, () => {
      console.log("Server http ready");
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
})();

// @ts-nocheck
const router = require("express").Router();

const {
  queryStringToFilters,
  generatePagination,
  generateSorts,
} = require("../Condorlabs/guidelines");

const User = require("../db/Models/User");

const ENDPOINT = "users";

(async () => {
  const total_record = await User.estimatedDocumentCount();
  if (total_record == 0) {
    try {
      let bulk_file = "";

      const fs = require("fs");

      const path = require("path");

      const stream = fs.createReadStream(
        path.resolve("src/db/example-data.csv"),
        { encoding: "utf8" }
      );

      stream.on("data", (row) => {
        bulk_file += row;
        stream.destroy();
      });

      stream.on("error", function (err) {
        console.log("Error file", err);
      });
      stream.on("close", (e) => {
        const bulk = [];
        const rows = bulk_file.split("\n");
        rows.forEach((row) => {
          const columns = row.split("|");
          bulk.push({
            fullname: columns[0],
            city: columns[1],
            email: columns[2],
          });
        });

        User.insertMany(bulk).then((items) => {
          console.log("Record insertes");
        });
      });
    } catch (error) {
      console.log(error);
    }
  }
})();

router.get("/", async (req, res) => {
  try {
    const { query } = req;

    let response = { status: "pass" };

    const aggregate = [];

    let items = [];

    let { filters, query_string } = queryStringToFilters(query);
    aggregate.push({ $match: filters });

    query.sort = query.sort ? query.sort : "";
    query.fields = query.fields ? query.fields : "";

    if (query.sort != "") {
      const sorts = generateSorts(query.sort);
      if (Object.keys(sorts).length > 0) {
        console.log(sorts);
        aggregate.push({ $sort: sorts });
      }
    }

    if (query.offset && query.limit) {
      query.limit = parseInt(query.limit);

      query.offset = parseInt(query.offset);

      aggregate.push({ $skip: query.offset });
      aggregate.push({ $limit: query.limit });

      query.size = query.size ? parseInt(query.size) : 0;

      //get total record
      const size =
        query.size > 0 ? query.size : await User.countDocuments(filters);

      response = {
        ...response,
        ...generatePagination(
          ENDPOINT,
          query_string.join(""),
          query.offset,
          query.limit,
          query.sort,
          query.fields,
          size
        ),
      };
    }

    //Project fields
    if (query.fields && query.fields != "") {
      const fields = query.fields.split(",");
      const _fields = {};
      fields.forEach((f) => {
        _fields[f] = 1;
      });
      if (fields.length > 0) {
        aggregate.push({ $project: _fields });
      }
    }

    console.log(aggregate);
    items = await User.aggregate(aggregate);

    //Add link href to detail for each user
    items = items.map((item) => ({
      ...item,
      href: `/users/${item._id}`,
    }));

    response.items = items;

    res.json(response);
  } catch (error) {
    res.status(500);
    res.json({ status: "fail", error_description: error.toString() });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const item = await User.findOne({ _id: req.params.id });
    res.json(item);
  } catch (error) {
    res.status(500);
    res.json({ status: "fail", error_description: error.toString() });
  }
});

router.post("/", async (req, res) => {
  try {
    const item = new User(req.body);
    await item.save();
    res.json({ ...item._doc, ...{ path: `/users/${item._id}` } });
  } catch (error) {
    res.status(500);
    res.json({ status: "fail", error_description: error.toString() });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const item = await User.findOneAndReplace(
      { _id: req.params.id },
      req.body,
      {
        new: true,
      }
    );
    res.json({ ...item._doc, ...{ path: `/users/${item._id}` } });
  } catch (error) {
    res.status(500);
    res.json({ status: "fail", error_description: error.toString() });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    console.log(req.body);
    const item = await User.findOneAndUpdate(
      { _id: req.params.id },
      { $set: req.body },
      {
        new: true,
      }
    );
    res.json({ item, ...{ path: `/users/${item._id}` } });
  } catch (error) {
    console.log(error);
    res.status(500);
    res.json({ status: "fail", error_description: error.toString() });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    console.log(req.body);
    const item = await User.findByIdAndDelete({ _id: req.params.id });
    res.json({ item, ...{ path: `/users/${item._id}` } });
  } catch (error) {
    console.log(error);
    res.status(500);
    res.json({ status: "fail", error_description: error.toString() });
  }
});

module.exports = router;

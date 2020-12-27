const initUsers = async (data) => {
  require("array.prototype.flatmap").shim();

  try {
    await global.elasticClient.indices.delete({
      index: "users",
    });
  } catch (error) {
    console.log("index users not deleted");
  }

  try {
    const mapping = await global.elasticClient.indices.create(
      {
        index: "users",
        body: {
          mappings: {
            aType: {
              properties: {
                id: { type: "text" },
                fullname: { type: "text" },
                city: { type: "text" },
                email: { type: "text" },
              },
            },
          },
        },
      },
      { ignore: [400] }
    );

    console.log(mapping);
  } catch (error) {
    console.log("Users map data error");
  }

  const body = data.flatMap((doc) => [
    { index: { _index: "users", _type: "mytype", _id: doc.id } },
    doc,
  ]);
  console.log(body);

  return global.elasticClient.bulk({
    refresh: true,
    body,
  });
};

const insert = (index, body) => {
  global.elasticClient
    .index({
      index,
      body,
    })
    .then((resp) => {
      console.log(index, " indexed");
    })
    .catch((err) => {
      console.log(index, " not indexed");
    });
};

const update = (index, id, body) => {
  global.elasticClient
    .update({
      index,
      id: id,
      body: {
        doc: request.body,
      },
    })
    .then((resp) => {
      console.log(index, " update");
    })
    .catch((err) => {
      console.log(index, " not update");
    });
};

const remove = (index, id) => {
  global.elasticClient
    .delete({
      index,
      id: id,
    })
    .then((resp) => {
      console.log(index, " deleted elastic");
    })
    .catch((err) => {
      console.log(index, " not deleted");
    });
};

const search = (index, q) => {
  return global.elasticClient
    .search({ index: index, ...q })
    .then((resp) => {
      console.log(index, " search elastic");
      console.log(resp);
      return resp.hits.hits;
    })
    .catch((err) => {
      console.log(index, " not search");
    });
};

module.exports = { insert, update, remove, search, initUsers };

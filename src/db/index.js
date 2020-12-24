const mongoose = require("mongoose");
const connect = () => {
  return new Promise(async (resolve, reject) => {
    try {
      await mongoose.connect("mongodb://mongo/mydatabase", {
        useNewUrlParser: true,
      });
      resolve();
    } catch (err) {
      reject(err);
    }
  });
};
module.exports = connect;

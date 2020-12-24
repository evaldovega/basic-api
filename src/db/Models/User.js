const { Schema, model } = require("mongoose");

const schema = new Schema({
  fullname: { type: String, required: true },
  city: { type: String, required: true },
  status: { type: String, default: "active" },
  email: String,
});
module.exports = model("User", schema);

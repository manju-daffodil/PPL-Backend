var mongoose = require("mongoose");
var details = mongoose.Schema({
  username: { type: String },
  password: { type: String },
  email: { type: String, unique: true },
  firstname: { type: String },
  lastname: { type: String },
  verify: { type: Boolean, default: false },
  profilePicture: { type: String, default: null }
});
module.exports = mongoose.model("user", details);

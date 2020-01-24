var mongoose = require("mongoose");
var detail = mongoose.Schema({
    email: { type: String },
    imageupload: { type: String },
    path: { type: String },
    uploadTime: { type: Date, default: Date.now },
    userId: { type: String },
    cat: { type: String },
    comment: [],
    likes: [],

});
module.exports = mongoose.model("imageDetails", detail);

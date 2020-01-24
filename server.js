var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var cors = require("cors");

var userrouter = require("./Router/userrouter");
var imageRouter = require("./Router/imageRouter");

app.use(express.static("uploads"));
app.use(
    cors({
        allowedHeaders: ["Content-Type", "Authorization", "Content-Disposition"]
    })
);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose.connect("mongodb://localhost:27017/PPL", {
    useNewUrlParser: true
});

app.use("/timeline", imageRouter);
app.use("/", userrouter);

var server = app.listen(8081, function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log("My server is running at http://%s:%s", host, port);
});

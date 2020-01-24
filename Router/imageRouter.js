var express = require("express");
var multer = require("multer");
var router = express.Router();

const { get } = require("lodash");

var imageApi = require("../Api/imageApi");
const { authorize } = require("../Middleware/middleware");

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "./uploads");
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + file.originalname);
    }
});

const upload = multer({ storage: storage });

router.post(
    "/imageUpload",
    authorize,
    upload.single("imageupload"),
    async (req, res) => {
        console.log("body", req.body);
        console.log("file", req.file);
        try {
            let { email, cat, userId, userToken, filter } = req.body;
            let { filename, path } = req.file;
            const imageData = {
                email,
                cat,
                imageupload: filename,
                path,
                userId,
                userToken
            };
            var result = await imageApi.imageUpload(imageData);
            result = await imageApi.findData(
                filter ? JSON.parse(filter) : {},
                {},
                { skip: 0, limit: 0, sort: { uploadTime: -1 } }
            );
            res.send(result);
        } catch (err) {
            res.send(err);
        }
    }
);

router.get("/getPostData", authorize, async function(req, res) {
    try {
        let params = JSON.parse(req.query.params);
        const fields = get(params, "fields", {});
        const filter = get(params, "filter", {});
        const option = get(params, "option", { skip: 1, limit: 1, sort: {} });
        var result = await imageApi.findData(filter, fields, option);
        res.send(result);
    } catch (err) {
        res.send(err);
    }
});

router.get("/count", authorize, function(req, res) {
    let params;
    if (req.query.params && isString(req.query.params)) {
        params = JSON.parse(req.query.params);
    }
    const filter = get(params, "filter", {});
    imageApi
        .countPost(filter)
        .then(response => {
            console.log("count--", response);
            res.send({ count: response });
        })
        .catch(err => {
            console.log(err);
        });
});

router.post("/uploadComment", authorize, async function(req, res) {
    try {
        console.log("Req.body--", req.body);
        const commentData = {
            comment: req.body.comment,
            //id: req.body.Category[0]._id
            id: req.body.imageId
        };
        var result = await imageApi.Comment(commentData);
        let query = {
            filter: { _id: commentData.id },
            fields: { comment: 1, email: 1 },
            option: { skip: 0, limit: 0, sort: { uploadTime: -1 } }
        };
        let { filter, fields, option } = query;
        result = await imageApi.findData(filter, fields, option);
        res.send(result);
    } catch (err) {
        res.send(err);
    }
});

router.post("/Likes", authorize, async function(req, res) {
    try {
        var result = await imageApi.imageLikes(req.body);
        result = await imageApi.findData(
            {},
            {},
            { skip: 0, limit: 0, sort: { uploadTime: -1 } }
        );
        res.send(result);
    } catch (err) {
        res.send(err);
    }
});
module.exports = router;

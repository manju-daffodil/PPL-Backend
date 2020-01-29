var express = require("express");
var router = express.Router();
var multer = require("multer");
var userapi = require("../Api/userapi");
const { generateToken } = require("../Middleware/middleware.js");
const httpStatus = require("http-status");
const { sendMail } = require("../sendGrid/sendMails");
const { authorize } = require("../Middleware/middleware");
const { get } = require("lodash");

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + file.originalname);
  }
});

const upload = multer({ storage: storage });

router.post("/registerUser", async function(req, res) {
  try {
    var result = await userapi.Adduser(req.body);
    if (result) {
      sendMail(result.email, result._id);
    }
    res.send([result]);
  } catch (err) {
    console.log(">>>>Error", err);
    res.send(err);
  }
});

router.get("/verify/:email", async function(req, res) {
  try {
    var result = await userapi.verifyUser(req.params.email);
    if (result.length > 0) {
      res.status(httpStatus.OK).json({
        message: "Verified Successfully"
      });
    } else {
      res.status(httpStatus.NOT_FOUND).json({
        message: "Not verified"
      });
    }
  } catch (err) {
    res.send(err);
  }
});

router.post("/forgot", async function(req, res) {
  try {
    var result = await userapi.findData(
      { email: req.body.email },
      { email: 1 },
      { skip: 0, limit: 0, sort: {} }
    );

    res.send(result);
  } catch (err) {
    res.send(err);
  }
});

router.post("/reset", async function(req, res) {
  try {
    var result = await userapi.resetPassword(req.body);
    res.send(result);
  } catch (err) {
    res.send(err);
  }
});

router.post("/login", async function(req, res) {
  try {
    let token = generateToken(req.body);
    let query = {
      filter: { email: req.body.email, password: req.body.password },
      fields: {
        _id: 1,
        verify: 1,
        firstname: 1,
        lastname: 1,
        profilePicture: 1
      },
      option: { skip: 0, limit: 0 }
    };
    let { filter, fields, option } = query;
    var result = await userapi.findData(filter, fields, option);

    if (result.length > 0) {
      res.send([...result, token]);
    } else {
      res.status(204).send({ data: "Invalid Username or Password" });
    }
  } catch (err) {
    res.send(err);
  }
});
router.post(
  "/updateUserDetails",
  authorize,
  upload.single("profilePicture"),
  async function(req, res) {
    try {
      let query = {
        filter: { _id: req.body._id },
        fields: {
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          profilePicture: req.file.filename
        },
        option: { skip: 0, limit: 0, sort: {} }
      };
      let { filter, fields, option } = query;
      var result = await userapi.Update(filter, fields, option);
      result = await userapi.findData(filter, {}, option);
      res.send(result);
    } catch (err) {
      console.log("Err--", err);
    }
  }
);
router.get("/isLogin", authorize, async function(req, res) {
  try {
    console.log("User in is login", req.user);
    // let params = JSON.parse(req.query.params);
    // console.log("Params:", params);
    // const filter = get(params, "filter", { _id: params._id });
    // const fields = get(params, "fields", {});
    // const option = get(params, "option", { skip: 0, limit: 0, sort: {} });
    var result = await userapi.findData({ email: req.user }, {}, {});
    console.log("result>>>>", result);
    res.send(result);
  } catch (err) {
    console.log("ERR", err);
  }
});

module.exports = router;

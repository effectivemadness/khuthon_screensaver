var express = require("express");
var router = express.Router();
var AWS = require("aws-sdk");
var fs = require("fs");
var atob = require("atob");
AWS.config.loadFromPath("./config.json");
var rekognition = new AWS.Rekognition();

const { exec } = require("child_process");

router.post("/", function (req, res, next) {
  console.log(req.body);
  if (req.body.landing == "true") {
    res.render("use", {
      method: req.body.type,
      collection: req.body.collection,
    });
  } else {
    image = req.body.image;
    console.log(req.body.collection);
    // console.log(image)
    //   var img_arr = req.body.image.split(',').map(function(item) {
    //     return parseInt(item, 10);
    // });
    // console.log(img_arr)
    // enc_data = Buffer.from(image.split("data:image/png;base64,")[1], 'base64').toString('ascii')
    if (image[11] == "p")
      enc_data = atob(image.split("data:image/png;base64,")[1]);
    else if (image[11] == "j")
      enc_data = atob(image.split("data:image/jpeg;base64,")[1]);
    var length = enc_data.length;
    imageBytes = new ArrayBuffer(length);
    var ua = new Uint8Array(imageBytes);
    for (var i = 0; i < length; i++) {
      ua[i] = enc_data.charCodeAt(i);
    }
    // console.log(imageBytes)
    var params = {
      CollectionId: req.body.collection,
      FaceMatchThreshold: 95,
      Image: {
        Bytes: imageBytes,
      },
      MaxFaces: 5,
    };
    rekognition.searchFacesByImage(params, function (err, data) {
      if (err) {
        console.log(err, err.stack);
      } else {
        if (data.FaceMatches.length > 0) {
          res.render("redirect", {
            error: "Recognized!",
            collection: req.body.collection,
          });
        } else {
          res.render("password", {
            collection: req.body.collection,
            type: req.body.type,
          });
        }
      }
    });
  }
});

router.get("/", function (req, res, next) {
  res.render("use");
});

module.exports = router;

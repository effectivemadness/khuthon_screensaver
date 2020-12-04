var express = require("express");
var router = express.Router();
var AWS = require("aws-sdk");
var fs = require("fs");
var atob = require('atob');
AWS.config.loadFromPath("./config.json");
var rekognition = new AWS.Rekognition();

const { exec } = require("child_process");

router.post("/", function (req, res, next) {
  console.log(req.body)
  if (req.body.landing == "true") {
    res.render('use', { method: req.body.type })
  }
  else {
    image = req.body.image
    // console.log(image)
    //   var img_arr = req.body.image.split(',').map(function(item) {
    //     return parseInt(item, 10);
    // });
    // console.log(img_arr)
    // enc_data = Buffer.from(image.split("data:image/png;base64,")[1], 'base64').toString('ascii')
    if(image[11]=='p')
      enc_data = atob(image.split("data:image/png;base64,")[1])
    else if(image[11]=='j')
      enc_data = atob(image.split("data:image/jpeg;base64,")[1])
    var length = enc_data.length;
    imageBytes = new ArrayBuffer(length);
    var ua = new Uint8Array(imageBytes);
    for (var i = 0; i < length; i++) {
      ua[i] = enc_data.charCodeAt(i);
    }
    // console.log(imageBytes)
    var params = {
      CollectionId: "6jj2",
      FaceMatchThreshold: 95,
      Image: {
        Bytes: imageBytes
      },
      MaxFaces: 5
    };
    rekognition.searchFacesByImage(params, function (err, data) {
      if (err) {
        console.log(err, err.stack);
      }
      else {
        if (data.FaceMatches.length>0){
          res.redirect("/");
        }
        else{
          // todo 잠금 페이지로 이동.
        }
      }
    });
  }
});

router.get("/", function (req, res, next) {
  res.render('use')
});

module.exports = router;

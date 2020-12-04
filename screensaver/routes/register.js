var express = require("express");
var router = express.Router();
var AWS = require("aws-sdk");
var fs = require("fs");
const path = require('path');
AWS.config.loadFromPath("./config.json");
const multer = require('multer');
var rekognition = new AWS.Rekognition();
const upload = multer({
  storage: multer.diskStorage({
      destination(req, file, cb){
          cb(null, 'uploads/')
     },
      filename(req, file, cb){
          // 확장자 추출
          const ext = path.extname(file.originalname);
          // 이름설정 (basename:확장자제외 파일명) + 현재시간 + 확장자
          cb(null, path.basename(file.originalname, ext) + new Date().valueOf() + ext);
     },
 }),
  limit: { fileSize: 5 * 1024 * 1024},
});
router.post("/", upload.single('img'), (req, res) => {
  console.log(req.file)
  
  fs.readFile(req.file.path, function (err, data) {
    if (err) {
      console.log(err);
    }
    params = {
      CollectionId: req.body.collection,
      DetectionAttributes: [],
      ExternalImageId: req.body.text,
      Image: { Bytes: data },
    };
    rekognition.indexFaces(params, function (err, data) {
      if (err) {
        console.log(err, err.stack);
        res.render('redirect', {error:"not registered! is there any faces on image?",collection: req.body.collection})
      }
      // an error occurred
      else console.log(data); // successful response

      fs.unlink(req.file.path, (err) => {
        if (err) throw err;
        console.log('image was deleted');
      });
      if(data.FaceRecords.length>0)
        res.render('redirect', {error:"registered!",collection: req.body.collection})
      else
      res.render('redirect', {error:"not registered! is there any faces on image?",collection: req.body.collection})
    });
  });
});

module.exports = router;

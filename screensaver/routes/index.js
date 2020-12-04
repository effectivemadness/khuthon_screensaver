var express = require("express");
var router = express.Router();
function makeid(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
var AWS = require("aws-sdk");
AWS.config.loadFromPath("./config.json");
var rekognition = new AWS.Rekognition();

/* GET home page. */
router.get("/", function (req, res, next) {
  var collectionID = makeid(8)
  var params = {
    CollectionId: collectionID
   };
   rekognition.createCollection(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log(data);           // successful response
   });
   console.log(collectionID)
  res.render("index", { title: "Express", error:"",collection: collectionID});
});
router.post("/", function (req, res, next){
  console.log(req.body.collection)
  res.render("index", { title: "Express", error:"",collection: req.body.collection});
});
module.exports = router;

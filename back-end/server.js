var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var cors = require("cors");
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;

var LOCATION_COLLECTION = "location";

var app = express();

// let's get our json on
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// connect to the database server!
var url = 'mongodb://localhost:27017/locations'
mongodb.MongoClient.connect(process.env.MONGODB_URI || url, function (err, database) {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  // Save database object from the callback for reuse.
  db = database;
  console.log("Database connection ready");

  // Initialize the app. another way to start a server in express
  var server = app.listen(process.env.PORT || 3000, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
  });
});

// when things go wrong
function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({"error": message});
}


app.post("/locations", function(req, res) {

  var newLocation = req.body;

  //insert one new contact
  db.collection(LOCATION_COLLECTION).insert(newLocation, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to create new place.");
    } else {
      res.status(201).json(doc);
    }
  });
});

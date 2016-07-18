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

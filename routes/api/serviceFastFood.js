var express = require('express');
var router = express.Router();
var sha1 = require('sha1');
var multer = require('multer');
var fsgalRest = require('fs');
var RESTAURANT = require("../../database/collections/Restaurants");
var MENUS = require("../../database/collections/Menus");
var CLIENTE = require("../../database/collections/Clients");
var ORDER = require("../../database/collections/Orders");
var LOAD =require("../../utils/calcular");


module.exports = router;

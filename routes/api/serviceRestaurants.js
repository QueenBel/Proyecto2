var express = require('express');
var router = express.Router();
var sha1 = require('sha1');

var RESTAURANT = require("../../database/collections/Restaurants");

router.post('/restaurants', function(req, res){
  var restaurant = {
    NombreRest : req.body.nameR,
    NitRest : req.body.nitR,
    PropietarioRest : req.body.proprietorR,
    CalleRest : req.body.streetR,
    TelefonoRest : req.body.phoneR,
  //  LogRest : req.body.LogR,
  //  LatRest : req.body.latR,
    FechaRegistro: new Date()
  }
  var restauranteDB = new RESTAURANT(restaurant);
  restauranteDB.save().then((resultado) => {
    console.log(resultado);
    if(resultado){
      res.status(201).json({
        msn : "resturante registrado"
      });
    } else{
      res.status(500).json({
        msn : "no se pudo registrar"
      });
    }
  })
});

module.exports = router;

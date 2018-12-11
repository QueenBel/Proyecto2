const mongoose = require("../connect");
var mon=require('mongoose');
var Schema = mon.Schema;
var restauranteSchema = new Schema({
  NombreRest : String, //name
  NitRest : String, //nit
  PropietarioRest : String, //property
  CalleRest : String, //street
  TelefonoRest : String, //phone
  LatRest : String, //lat
  LonRest : String, //log
  LogoRest : String, //logo
  GaleriaRest : Array, //picture
  FechaRegistro: Date // registerdate
});

var restaurante = mongoose.model('restaurante', restauranteSchema);
module.exports = restaurante;

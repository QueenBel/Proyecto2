var mongoose = require("../connect");

var restauranteSchema = {
  NombreRest : String,
  NitRest : Number,
  PropietarioRest : String,
  CalleRest : String,
  TelefonoRest : String,
  LonRest : Number,
  LatRest : Number,
  LogoRest : String,
  GaleriaRest : Array,
  FechaRegistro: Date
}

var restaurante = mongoose.model('restaurante', restauranteSchema);
module.exports = restaurante;

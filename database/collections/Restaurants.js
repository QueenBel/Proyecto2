var mongoose = require("../connect");
//var Schema mongoose.Schema;

var restauranteSchema = {
  //_id : Schema.Types.ObjectId,
  NombreRest : String,
  NitRest : Number,
  PropietarioRest : String,
  CalleRest : String,
  TelefonoRest : String,
  //LogRest : Number,
  //LatRest : Number,
  LogoRest : String,
  GaleriaRest : Array,
  FechaRegistro: Date
}

var restaurante = mongoose.model('restaurante', restauranteSchema);
module.exports = restaurante;

const mongoose = require("../connect");
var mon = require('mongoose');
var Schema = mon.Schema;
//var pedidoSchema = {
var pedidoSchema = new Schema({
  Menu : Array, //idmenu
  //idRestorant : String,
  //idRestorant : {type: Schema.Types.ObjectId, ref: 'restaurante'},  //Array(1),
  //FastFoods : Array,
  idCliente : String,
  //idCliente : {type: Schema.Types.ObjectId, ref: 'cliente'},
  latPed : String,
  lonPed : String,
  direccionPed : String, //street
  pagoTotal : Number,
  //cantidadTotal : Number,
  fechaPedido :Date //registerdate
});
//}

var pedido = mongoose.model('pedido', pedidoSchema);
module.exports = pedido;

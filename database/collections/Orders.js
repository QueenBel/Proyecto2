const mongoose = require("../connect");
var mon = require('mongoose');
var Schema = mon.Schema;
var pedidoSchema = new Schema({
  CodigoPed: Number,
  Menu : Array,
  PagoTotal : Number,
  CantidadTotal : Number,
  NomCliente : String,
  CorrCliente : String,
  NitCedCliente : String,
  LatPed : String,
  LonPed : String,
  DireccionPed : String, //street
  FechaPedido :Date //registerdate
});
var pedido = mongoose.model('pedido', pedidoSchema);
module.exports = pedido;

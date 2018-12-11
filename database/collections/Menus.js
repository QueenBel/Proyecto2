const mongoose = require('../connect');
var mon=require('mongoose');
var Schema = mon.Schema;
var menuSchema = new Schema({
  //TipoMen : String,
  NombreMen : String, //name
  DescripcionMen: String, //description
  ProductoMen: String, //picture
  PrecioMen : Number, //price
  idrestaurant: String,
  registerdate : Date
});

var menu = mongoose.model('menu', menuSchema);
module.exports = menu;

var mongoose = require('../connect');

var menuSchema = {
  TipoMen : String,
  NombreMen : String,
  DescripcionMen: String,
  ProductoMen: Array,
  PrecioMen : Number,
  date : Date
};

var menu = mongoose.model('menu', menuSchema);
module.exports = menu;

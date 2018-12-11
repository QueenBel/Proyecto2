var mongoose = require("./connect");
var COMPRAR= {
  tiempo: String,
  prenda: String,
  usuario: String,
  libro1: String,
//  password: String,
  registerDate: Date
}
const comprars = mongoose.model('comprars', COMPRAR);
module.exports = comprars;

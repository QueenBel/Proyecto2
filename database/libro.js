var mongoose = require("./connect");
var LIBRO = {
  name: String,
  precio: Number,
//  password: String,
  registerDate: Date
}
const libros = mongoose.model('libros', LIBRO);
module.exports = libros;

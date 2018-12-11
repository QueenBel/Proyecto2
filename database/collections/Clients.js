const mongoose = require("../connect");
var mon = require('mongoose');
var Schema = mon.Schema;
var clienteSchema = ({
  NombreCli : String, //name
  NitCli : String, //ci
  CelularCli : String, //phone
  CorreoCli : String, //email
  password : String,
  registerdate : Date
});

var cliente = mongoose.model('cliente', clienteSchema);
module.exports = cliente;

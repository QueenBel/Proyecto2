var mongoose = require("./connect");
var CASAS = {
  title: String,
  description: String,
  image: String
}
const casa = mongoose.model('casa', CASAS);
module.exports = casa;

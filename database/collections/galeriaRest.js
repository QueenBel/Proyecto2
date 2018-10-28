var mongoose = require('../connect');

var galeriaSchema = {
  name : String,
  pathFisico : String,
  pathURL : String,
//  restID : String,
  date : Date
};

var gallery = mongoose.model('gallery', galeriaSchema);
module.exports = gallery;

var mongoose = require('../connect');

var galeriaMenSchema = {
  nameimg : String,
  phiscalpath: String,
  relativepath : String,
  menID : String,
  date : Date
};

var galleryMen = mongoose.model('galleryMen', galeriaMenSchema);
module.exports = galleryMen;

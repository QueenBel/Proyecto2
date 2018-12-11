var mongoose = require("./connect");
var USERS = {
  name: String,
  lastname: String,
//  password: String,
  registerDate: Date
}
const users = mongoose.model('users', USERS);
module.exports = users

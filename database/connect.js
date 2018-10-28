const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/ComidaRapida", { useNewUrlParser: true });
mongoose.set('useFindAndModify', false);
module.exports = mongoose;

const mongoose = require('../connect');
const Schema = mongoose.Schema;

const clientSchema = Schema({
    firstname: String,
    surname: String,
    email: String,
    phone: String,
    ci: String,
    password: String,
    registerdate: Date
});




const client = mongoose.model('client', clientSchema);

module.exports = client;

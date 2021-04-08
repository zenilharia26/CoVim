const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema({

    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    hospitalType: { type: String, required: true },
    address: { type: String, required: true },
    password: { type: String, required: true },
    license: { type: String, required: true }

});

module.exports = mongoose.model('Hospital', hospitalSchema);
const mongoose = require('mongoose');

const personSchema = new mongoose.Schema({

    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    gender: { type: String, required: true },
    address: { type: String, required: true },
    password: { type: String, required: true },
    birthCertificate: { type: String, required: true }

});

module.exports = mongoose.model('Person', personSchema);
const mongoose = require('mongoose');

const vaccinesSchema = new mongoose.Schema({
    covaxin: { type: Number },
    covishield: { type: Number },
});

module.exports = mongoose.model('Vaccine', vaccinesSchema);
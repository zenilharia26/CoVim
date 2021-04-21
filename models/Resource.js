const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({

    hospitalId: { type: String, required: true },
    covaxin: { type: Number, default: 0 },
    covishield: { type: Number, default: 0 },
    beds: { type: Number, default: 50 },
    oxygenCylinders: { type: Number, default: 50 }

});

module.exports = mongoose.model('Resource', resourceSchema);
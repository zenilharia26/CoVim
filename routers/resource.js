const { request } = require('express');
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Hospital = require('../models/Hospital');
const Resource = require('../models/Resource');
const Vaccines = require('../models/Vaccines');

function authenticate(req, res, next) {
    const token = req.query.token;

    jwt.verify(token, 'verySecretValue', (err, decoded) => {
        if (err) {
            console.log(err);
            let message = 'Internal Server Error';
            return res.status(500).send({
                message: message
            });
        } else {
            req.hospitalId = decoded.hospitalId;
            next();
        }
    });
}

router.get('/', authenticate, (req, res) => {
    
    const id = req.hospitalId;

    Hospital.findById(id, (err, result) => {
        if (err) {
            console.log(err);
            let message = 'Internal Server Error';
            return res.status(500).send({
                message: message
            });
        } else if (result) {
            Resource.findOne({hospitalId: id}, {_id: 0, hospitalId: 0}, (err, result) => {
                if (err) {
                    console.log(err);
                    let message = 'Internal Server Error';
                    return res.status(500).send({
                        message: message
                    });
                } else if (result) {
                    return res.status(200).send({
                        resources: result
                    });
                } else {
                    const resource = new Resource({
                        hospitalId: id,
                        covaxin: 0,
                        covishield: 0,
                        beds: 50,
                        oxygenCylinders: 50
                    });

                    resource.save();

                    return res.status(200).send({
                        resources: resource
                    });
                }
            });
        } else {
            console.log('Illegal token');
            return res.status(400).send({
                message: 'Not Authorized'
            });
        }
    });
});

router.post('', authenticate, (req, res) => {
    // console.log(req.params);
    // console.log(req.body);
    const reqCovaxin = req.body.covaxin;
    const reqCovishield = req.body.covishield;

    Vaccines.updateOne({covaxin: {$gte: reqCovaxin}, covishield: {$gte: reqCovishield}}, 
        { "$inc": {covaxin: -reqCovaxin, covishield: -reqCovishield}}, 
        (err, result) => {
        if (err) {
            console.log(err);
            let message = 'Internal Server Error';
            return res.status(500).send({
                message: message
            });
        } else if (result) {
            const hospitalId = req.hospitalId;

            Resource.findOneAndUpdate(
                {hospitalId: hospitalId}, 
                {"$inc": {covaxin: reqCovaxin, covishield: reqCovishield}},
                { new: true },
                (err, result) => {
                    if (err) {
                        console.log(err);
                        let message = 'Internal Server Error';
                        return res.status(500).send({
                            message: message
                        });
                    } else if (result) {
                        console.log(result);
                        let message = 'Request Accepted';
                        return res.status(200).send({
                            message: message,
                            resources: result
                        });
                    }
                }
            );
        } else {
            let message = 'Not Enough Vaccines Available';
            return res.status(500).send({
                message: message,
                resources: null
            });
        }
    });
});

module.exports = router;
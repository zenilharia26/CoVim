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
            console.log('Invalid token');
            return res.status(400).send({
                message: 'Not Authorized'
            });
        }
    });
});

router.post('', authenticate, (req, res) => {
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
        } else if (result && result.nModified === 1) {
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

router.put('', authenticate, (req, res) => {
    const hospitalId = req.hospitalId;
    const covaxinUtilised = req.body.covaxin;
    const covishieldUtilised = req.body.covishield;

    Resource.findOneAndUpdate(
        { hospitalId: hospitalId },
        { "$inc": {covaxin: -covaxinUtilised, covishield: -covishieldUtilised} },
        { new: true },
        (err, result) => {
            if (err) {
                console.log(err);
                let message = 'Internal Server Error';
                return res.status(500).send({
                    message: message
                });
            } else if (result) {
                let message = 'Updated Successfully';
                return res.status(200).send({
                    message: message,
                    resources: result
                });
            } else {
                let message = 'Invalid Token';
                return res.status(400).send({
                    message: message
                });
            }
        }
    );
});

module.exports = router;
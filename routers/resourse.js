const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Hospital = require('../models/Hospital');
const Resource = require('../models/Resource');

router.get('/', (req, res) => {
    const token = req.query.token;

    jwt.verify(token, 'verySecretValue', (err, decoded) => {
        if (err) {
            console.log('There was an error');
            return res.status(500).send({
                message: err
            });
        } else {
            const id = decoded.hospitalId;
            Hospital.findById(id, (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send({
                        message: err
                    });
                } else if (result) {
                    Resource.findOne({hospitalId: id}, {_id: 0, hospitalId: 0}, (err, result) => {
                        if (err) {
                            console.log(err);
                            return res.status(500).send({
                                message: err
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
            })
        }
    });
});

module.exports = router;
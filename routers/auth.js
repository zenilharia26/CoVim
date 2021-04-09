const express = require('express');
const router = express.Router();
const multer = require('multer');
const Hospital = require('../models/Hospital');
const Person = require('../models/Person');
const bcrypt = require('bcryptjs');
const salt = 10;

const storage = multer.diskStorage({
    destination: './public/uploads',
    filename: (req, file, callback) => {
        callback(null, file.originalname);
    }
});

const upload = multer({
    storage: storage
});

function getCollectionDocument(email) {
    Hospital.findOne({email: email}, (error, result) => {
        if (error) {
            return new Error('Database error.');
        } else if (result) {
            return result;
        } else {
            Person.findOne({email: email}, (error, result) => {
                if (error) {
                    return new Error('Database error.');
                } else {
                    return result;
                }
            });
        }
    });
}

router.post('/signup', upload.single('document'), (req, res) => {

    const name = req.body.name;
    const phone = req.body.phone;
    const email = req.body.email;
    const address = req.body.address;
    let hashedPassword;

    bcrypt.hash(req.body.password, salt, (err, hash) => {
        if (err) {
            console.log(err);
            res.status(500).json({ error: err });
        } else {
            hashedPassword = hash;

            if (req.body.registeringEntity === 'hospital') {
                const newHospital = new Hospital({
                    name: name,
                    phone: phone,
                    email: email,
                    hospitalType: req.body.hospitalType,
                    address: address,
                    password: hashedPassword,
                    license: req.file.originalname
                });
        
                newHospital.save();
        
                res.status(201).json({ message: 'Registered Successfully' });
            } else {
                const newPerson = new Person({
                    name: name,
                    phone: phone,
                    email: email,
                    gender: req.body.gender,
                    address: address,
                    password: hashedPassword,
                    birthCertificate: req.file.originalname
                });
        
                newPerson.save();
        
                res.status(201).json({ message: 'Registered Successfully' });
            }
        }
    });
});

router.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const user = getCollectionDocument(email);

    if (user instanceof Error) {
        res.status(501).json({ message: user });
    } else if (user) {
        
    } else {
        res.status(404).json({ message: 'Email does not exist' });
    }
});

module.exports = router;
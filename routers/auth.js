const express = require('express');
const router = express.Router();
const multer = require('multer');
const Hospital = require('../models/Hospital');
const Person = require('../models/Person');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
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
            return res.status(500).json({ error: err });
        } else {
            hashedPassword = hash;
        }

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
    
            return res.status(201).json({ message: 'Registered Successfully' });
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
    
            return res.status(201).json({ message: 'Registered Successfully' });
        }
    });
});

router.post('/login', async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    await Hospital.findOne({email: email}, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                message: err
            });
        } else if (result) {
            console.log('Found user');
            req.user = result;
            next();
        } else {
            Person.findOne({email: email}, (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({
                        message: err
                    });
                } else if (result) {
                    console.log('Found user');
                    req.user = result;
                    next();
                } else {
                    req.user = null;
                    next();
                }
            });
        }
    });
}, (req, res) => {
    if (req.user) {
        const user = req.user;
        const password = req.body.password;
        bcrypt.compare(password, user.password, (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    message: err
                });
            } else if (result) {
                const token = jwt.sign({name: user.name}, 'verySecretValue', {expiresIn: '1h'});

                return res.status(200).json({
                    message: 'Login successful',
                    token: token
                });
            } else {
                return res.status(401).json({
                    message: 'Invalid Password'
                });
            }
        });
    } else {
        return res.status(404).json({
            message: 'User not found'
        });
    }
});

module.exports = router;
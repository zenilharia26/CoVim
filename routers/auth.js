const express = require('express');
const router = express.Router();
const multer = require('multer');
const Hospital = require('../models/Hospital');
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

router.post('/signup', upload.single('document'), (req, res) => {

    const name = req.body.name;
    const phone = req.body.phone;
    const email = req.body.email;
    const address = req.body.address;
    let hashedPassword;

    bcrypt.hash(req.body.password, salt, (err, hash) => {
        if (err) {
            console.log(err);
            return res.status(500).send({ error: err });
        } else {
            hashedPassword = hash;
        }

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
    
        return res.status(201).send({ message: 'Registered Successfully' });
    });
});

router.post('/login', (req, res, next) => {
    const email = req.body.email;
    const sentPassword = req.body.password;

    Hospital.findOne({ email: email }, (err, user) => {
        if (err) {
            console.log(err);
            return res.status(500).send({
                message: 'Internal Server Error'
            });
        } else if (user) {
            const userPassword = user.password;

            bcrypt.compare(sentPassword, userPassword, (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send({
                        message: 'Internal Server Error'
                    });
                } else if (result) {
                    const token = jwt.sign({hospitalId: user._id}, 'verySecretValue', {expiresIn: '1h'});
                    let message = 'Login Successful.'
                    return res.status(200).send({
                        message: message,
                        token: token
                    });
                } else {
                    let message = 'Invalid Password';
                    console.log(message);
                    return res.status(401).send({
                        message: message
                    });
                }
            });
        } else {
            let message = 'User not found.';
            console.log(message);
            return res.status(404).send({
                message: message
            });
        }
    });
}); 

module.exports = router;
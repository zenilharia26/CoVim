const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

mongoose.connect('mongodb://localhost:27017/CoVim', {useNewUrlParser: true, useUnifiedTopology: true}, (err) => {
    if (err) {
        console.log('There was an error connecting to the database!');
    } else {
        console.log('Connected to database');
    }
});

const app = express();

app.use(cors());

const port = 3000;

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
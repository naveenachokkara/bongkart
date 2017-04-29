/**
 * Created by SESA435400 on 4/29/2017.
 */
'use strict';

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const config = require('./configuration/database');
const bong = require('./routes/bong');

const app = express();

mongoose.Promise = global.Promise;
mongoose.connect(config.database);
mongoose.connection.on('connected',() => {
    console.log('mongodb is connected');
});

mongoose.connection.on('error',() => {
   console.log('mongodb is connection error');
});

app.use(bodyParser.json());
app.use(cors());
app.use('/bong',bong);

app.listen('9000',() => {
    console.log('server is connected');
});
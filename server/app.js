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
const user = require('./routes/user');
const order = require('./routes/order');
const cart = require('./routes/cart');
const address = require('./routes/address');
const whishList = require('./routes/whishlist');
const brand = require('./routes/brand');
const banner = require('./routes/banner');

//require multer for the file uploads
const multer = require('multer');
// set the directory for the uploads to the uploaded to
const DIR = './uploads/';
const port = process.env.PORT || 3000;
const uuid = require('uuid');
const fs = require('fs');


const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use('/uploads', express.static(__dirname + '/uploads'));


//define the type of upload multer would be doing and pass in its destination, in our case, its a single file with the name photo
const storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, uuid()+'-'+file.originalname);
    }
});
const upload = multer({ //multer settings
    storage: storage
}).single('file');

app.get('/',(req,res,next) => {
    res.send('<h1>This is Bong API Page...</h1>');
});

/** API path that will upload the files */
app.post('/upload', function(req, res) {
    upload(req,res,function(err){
        if(err){
            res.status(400).json({error_code:1,err_desc:err});
        } else{
            res.json({error_code:0,err_desc:null,file:req.file});
        }
    })
});

/** API path that will delete a file */
app.delete('/resource', function(req, res) {
    fs.unlink(req.body.relativeURL, (err) => {
        if(err){
            res.status(400).json({"status":"error","error":err,"message":"Failed to delete resource"});
        } else{
            res.json({"status":"success","message":"Resource deleted successfully"});
        }
    });
});

mongoose.Promise = global.Promise;
mongoose.connect(config.database);
mongoose.connection.on('connected',() => {
    console.log('mongodb is connected');
});

mongoose.connection.on('error',() => {
   console.log('mongodb is connection error');
});

app.use('/bong',bong);
app.use('/user',user);
app.use('/order',order);
app.use('/cart',cart);
app.use('/address',address);
app.use('/whishList',whishList);
app.use('/brand',brand);
app.use('/banner',banner);

app.listen(port,() => {
    console.log('server is connected at port '+port);
});
/**
 * Created by SESA435400 on 4/29/2017.
 */
'use strict';

const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Cart = require('../models/cart');
const extend = require('extend');
const _ = require('lodash');
var ObjectId = mongoose.Types.ObjectId;

router.post('/addItem',(req,res,next) => {
    var reqData = {};
    reqData.deviceId = req.body.deviceId;
    reqData.user = new ObjectId(req.body.userId);
    reqData.item = new ObjectId(req.body.item);
    let newCart = new Cart(reqData);
    newCart.save((err,cart) => {
        if(err){
            res.json({status:'failure'});
        }
        else{
            res.json({status:'Saved successfully'});
    }
});
});


module.exports = router;
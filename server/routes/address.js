'use strict';

const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Address = require('../models/address');
const _ = require('underscore');
const async = require('async');
var ObjectId = mongoose.Types.ObjectId;

router.post('/', function (req, res) {
    let newAddress = new Address(req.body);
    newAddress.save((err, address) => {
        if (err) {
            res.json({ "status": "error" ,message:"Address creation error",error:err});
        } else {
            res.json(address);
        }
    });
});

router.get('/userAddresses/:userId', function (req, res) {
    Address.find({ "userId": req.params.userId }, (err, address) => {
        if (err) {
            res.json({ "status": "error",message:"Failed to fetch user addresses",error:err });
        } else {
            res.json(address);
        }
    });
});

router.get('/:id', function (req, res) {
    Address.findOne({ _id: req.params.id }, (err, address) => {
        if (err) {
            res.json({ "status": "error" ,message:"Failed to fetch address",error:err });
        } else {
            res.json(address);
        }
    });
});
router.put('/:id', (req, res, next) => {
    req.body["$currentDate"] = {
        "updated": true
    };
    Address.findOneAndUpdate({ _id: req.params.id, userId: req.body.userId }, req.body, {
        new: true,
        runValidators: true
    }, (err, address) => {
        if (err) {
            res.json({ status: 'error', message:"Failed to update address",error:err });
        }
        else {
            res.json(address);
        }
    });
});
router.delete('/:id', function (req, res) {
    Address.remove({ _id: req.params.id }, (err, address) => {
        if (err) {
            res.json({ "status": "error",message:"Failed to delete" });
        } else {
            res.json({ "status": "success", "addressId": req.params.id,message:"Address deleted successfully"});
        }
    });
});
module.exports = router;
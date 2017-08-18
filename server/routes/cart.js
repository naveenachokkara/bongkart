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

router.post('/addItem', (req, res) => {
    var reqData = {};
    reqData.deviceId = req.body.deviceId;
    reqData.userId = req.body.userId ? req.body.userId : null;
    reqData.item = req.body.item;
    Cart.findOneAndUpdate({
        "deviceId": req.body.deviceId
    }, {
            "$push": { "items": reqData.item },
            'updated': new Date().toISOString(),
            "userId": reqData.userId
        }, {
            upsert: true,
            setDefaultsOnInsert: true,
            new: true,
            runValidators: true
        }, function (err, cart) {
            if (err) {
                console.log(err);
                res.json({ "status": "error" });
            } else {
                res.json(cart);
            }
        });
});

router.post('/updateItem', (req, res) => {
    var reqData = {};
    reqData.deviceId = req.body.deviceId;
    reqData.item = req.body.item;
    console.log(reqData);
    Cart.update({
        "deviceId": req.body.deviceId,
        "items": { "$elemMatch": { "bongId": new ObjectId(reqData.item.bongId) } }
    },
        {
            $set: { "items.$.quantity": reqData.item.quantity },
            $currentDate: {
                "updated": true
            }
        },
        function (err, cart) {
            if (err) {
                console.log(err);
                res.json({ "status": "error" });
            } else {
                res.json(cart);
            }
        });
});

router.delete('/removeItem', (req, res) => {
    var reqData = {};
    reqData.deviceId = req.query.deviceId;
    reqData.itemId = req.query.itemId;
    console.log(reqData);
    Cart.update({
        "deviceId":reqData.deviceId
    },
        {
            "$pull": { "items":{"bongId": new ObjectId(reqData.itemId) } },
            "$currentDate": {
                "updated": true
            }
        },
        function (err, cart) {
            if (err) {
                console.log(err);
                res.json({ "status": "error" });
            } else {
                res.json(cart);
            }
        });
});

router.get('/details', (req, res) => {
    Cart.findOne({
        "deviceId": req.query.deviceId
    },
        function (err, cart) {
            if (err) {
                console.log(err);
                res.json({ "status": "error" });
            } else {
                res.json(cart);
            }
        });
});
module.exports = router;
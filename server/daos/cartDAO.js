'use strict';
const express = require("express");
const mongoose = require('mongoose');
const _ = require('underscore');
const router = express.Router();
const Cart = require('../models/cart');
const ObjectId = mongoose.Types.ObjectId;
const config = require('../configuration/config.json');
module.exports = {
    getCart: function (reqData, callback) {
        var matchQuery = { "$match": {} };
        if (reqData.userId) {
            matchQuery["$match"]["userId"] = new ObjectId(reqData.userId);
        } else if (reqData.deviceId) {
            matchQuery["$match"]["deviceId"] = reqData.deviceId;
        }
        Cart.aggregate([
            matchQuery,
            {
                "$unwind": { "path": "$items", "preserveNullAndEmptyArrays": true }
            }, {
                "$lookup": { "from": "bongs", "localField": "items.bongId", "foreignField": "_id", as: "products" }
            }, {
                "$unwind": "$products"
            }, {
                "$group": {
                    "_id": "$_id",
                    "items": { "$push": "$items" },
                    "products": { "$push": "$products" }
                }
            }], function (err, cart) {
                if (err) {
                    callback(err);
                } else {
                    if (cart && cart[0]) {
                        _.each(cart[0].products, function (bong) {
                            _.each(bong.images, function (image) {
                                if (image.relativeURL) {
                                    image.imageUrl = config.serverURI + image.relativeURL;
                                } else {
                                    image.imageUrl = image.url + "s/" + image.file.name;
                                }
                            })
                        });
                    }
                    callback(null, cart);
                }
            });
    }
}
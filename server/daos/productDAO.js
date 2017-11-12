'use strict';
const express = require("express");
const mongoose = require('mongoose');
const _ = require('underscore');
const router = express.Router();
const bong = require('../models/bong');
const WhishList = require('../models/whishlist');
const Cart = require('../models/cart');
const ObjectId = mongoose.Types.ObjectId;
const config = require('../configuration/config.json');
const async = require('async');
function addImageURL(bong) {
    _.each(bong.images, function (image) {
        if (image.relativeURL) {
            image.imageUrl = config.serverURI + image.relativeURL;
        } else {
            image.imageUrl = image.url + "s/" + image.file.name;
        }
    });
}
module.exports = {
    getBongs: function (reqQuery, callback) {
        var skip = 0;
        var brandQuery = [
            {
                "$lookup": {
                    "from": "brands",
                    "localField": "brandId",
                    "foreignField": "_id",
                    "as": "brands"
                }
            },
            {
                "$unwind": "$brands"
            },
            {
                "$addFields": {
                    "brand": "$brands.name"
                }
            }
        ];
        var query = [].concat(brandQuery);
        var matchQuery = {
            "$match": {
            }
        };
        var sortQuery = { $sort: {} };
        try {
            if ((reqQuery.matchBy && typeof reqQuery.matchBy.discount === "number") || (reqQuery.sortBy && (reqQuery.sortBy.discount === 1 || reqQuery.sortBy.discount === -1))) {
                query.push({
                    "$addFields": {
                        "discount": {
                            "$subtract": [100, {
                                "$multiply": [
                                    {
                                        "$divide": [
                                            "$price",
                                            "$originalPrice"
                                        ]
                                    },
                                    100
                                ]
                            }]
                        }
                    }
                });
                if(reqQuery.matchBy){
                    matchQuery.$match.discount = { $gte: reqQuery.matchBy.discount };
                }
            }
            if (reqQuery.matchBy && reqQuery.matchBy.brands && Array.isArray(reqQuery.matchBy.brands) && reqQuery.matchBy.brands.length) {
                matchQuery.$match.brand = { "$in": reqQuery.matchBy.brands };
            }
            if (reqQuery.matchBy && reqQuery.matchBy.brandId ) {
                matchQuery.$match.brandId = new ObjectId(reqQuery.matchBy.brandId);
            }
            if (reqQuery.matchBy && reqQuery.matchBy.bongId) {
                matchQuery.$match._id = new ObjectId(reqQuery.matchBy.bongId);
            }
            if (Object.keys(matchQuery.$match).length > 0) {
                query.push(matchQuery);
            }
            if (reqQuery.sortBy) {
                _.each(reqQuery.sortBy, function (val, key) {
                    val = parseInt(val);
                    if (val === -1 || val === 1) {
                        switch (key) {
                            case "time":
                                sortQuery.$sort.created = val;
                                break;
                            case "price":
                                sortQuery.$sort.price = val;
                                break;
                            case "discount":
                                sortQuery.$sort.discount = val;
                                break;
                        }
                    }
                });

            }
            if (Object.keys(sortQuery.$sort).length > 0) {
                query.push(sortQuery);
            }
            if (reqQuery.skip) {
                query.push({ $skip: parseInt(reqQuery.skip) });
            }

            if (reqQuery.limit) {
                query.push({ $limit: parseInt(reqQuery.limit) });
            }
            if (query.length === 0) {
                sortQuery.$sort.created = 1;
                query.push(sortQuery);
            }
            bong.aggregate(query, (err, bongs) => {
                if (err) {
                    callback(err)
                }
                else {
                    if (reqQuery.userId) {
                        // Finding whether it is in cart or whishlist
                        async.parallel({
                            cart: function (done) {
                                Cart.findOne({ "userId": reqQuery.userId }, function (err, cart) {
                                    if (err) {
                                        done(err);
                                    } else {
                                        done(null, cart);
                                    }
                                });
                            },
                            whishlist: function (done) {
                                WhishList.findOne({ "userId": reqQuery.userId }, function (err, whishlist) {
                                    if (err) {
                                        done(err);
                                    } else {
                                        done(null, whishlist);
                                    }
                                });
                            }
                        }, function (err, result) {

                            if (err) {
                                callback(err);
                            } else {
                                _.each(bongs, function (bong) {
                                    bong.inCart = _.find(result.cart && result.cart.items, function (item) { return bong._id.equals(item.bongId) }) ? true : false;
                                    bong.inWhishlist = _.find(result.whishlist && result.whishlist.items, function (item) { return bong._id.equals(item.bongId) }) ? true : false;
                                    addImageURL(bong);
                                });
                                callback(null,bongs);
                            }
                        });
                    } else if (reqQuery.deviceId) {
                        // Finding whether it is in cart or not
                        Cart.findOne({ "deviceId": reqQuery.deviceId }, function (err, cart) {
                            if (err) {
                                callback(err)
                            } else {
                                _.each(bongs, function (bong) {
                                    bong.inCart = _.find(cart && cart.items, function (item) { return bong._id.equals(item.bongId) }) ? true : false;
                                    bong.inWhishlist = false;
                                    addImageURL(bong);
                                });
                                callback(null,bongs);
                            }
                        });
                    } else {
                        _.each(bongs, function (bong) {
                            addImageURL(bong);
                        });
                        callback(null,bongs);
                    }
                }
            });
        } catch (e) {
            callback(e);
        }
    }
}
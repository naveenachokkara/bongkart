/**
 * Created by SESA435400 on 4/29/2017.
 */
'use strict';

const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Cart = require('../models/cart');
const extend = require('extend');
const _ = require('underscore');
const async = require('async');
var ObjectId = mongoose.Types.ObjectId;
const cartDAO = require('../daos/cartDAO');

router.post('/addItem', (req, res) => {
    var reqData = {};
    reqData.deviceId = req.body.deviceId ? req.body.deviceId : null;
    reqData.userId = req.body.userId ? req.body.userId : null;
    reqData.item = req.body.item;

    if (reqData.deviceId || reqData.userId) {
        var matchQuery = {};
        if (reqData.userId) {
            matchQuery["userId"] = reqData.userId;
        } else if (reqData.deviceId) {
            matchQuery["deviceId"] = reqData.deviceId;
        }
        Cart.findOne(matchQuery, function (err, cart) {
            if (err) {
                res.json({ "status": "error" });
            } else {
                if (cart && _.find(cart.items, function (item) {
                    return item.bongId && item.bongId.equals(reqData.item.bongId)
                })) {
                    res.json({ "status": "error", "message": "Item already in cart" });
                } else {
                    Cart.findOneAndUpdate(
                        matchQuery,
                        {
                            "$push": { "items": reqData.item },
                            "$currentDate": {
                                "updated": true
                            },
                            "userId": reqData.userId ? reqData.userId : null,
                            "deviceId": reqData.userId ? null : reqData.deviceId
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
                }
            }
        });
    } else {
        res.json({ "status": "error", "message": "invalid inputs" });
    }
});

router.put('/updateItem', (req, res) => {
    var reqData = {};
    reqData.deviceId = req.body.deviceId;
    reqData.userId = req.body.userId;
    reqData.item = req.body.item;
    console.log(reqData);
    if (reqData.deviceId || reqData.userId) {
        var matchQuery = {};
        if (reqData.userId) {
            matchQuery["userId"] = reqData.userId;
        } else if (reqData.deviceId) {
            matchQuery["deviceId"] = reqData.deviceId;
        }
        matchQuery["items"] = { "$elemMatch": { "bongId": new ObjectId(reqData.item.bongId) } };
        Cart.update(
            matchQuery,
            {
                $set: { "items.$.quantity": reqData.item.quantity },
                $currentDate: {
                    "updated": true
                }
            },
            function (err, updateInfo) {
                if (err) {
                    console.log(err);
                    res.json({ "status": "error" });
                } else {
                    cartDAO.getCart(reqData, function (err, cart) {
                        if (err) {
                            res.json({ "status": "error" });
                        } else {
                            if (cart[0]) {
                                cart[0].items = _.filter(cart[0].items, function (item) {
                                    return item.bongId && item.bongId.equals(new ObjectId(req.body.item.bongId))
                                })
                                cart[0].products = _.filter(cart[0].products, function (item) {
                                    return item._id.equals(new ObjectId(req.body.item.bongId));
                                })
                            }
                            res.json(cart);
                        }
                    });
                }
            });
    } else {
        res.json({ "status": "error", "message": "invalid inputs" });
    }

});

router.delete('/removeItem', (req, res) => {
    var reqData = {};
    reqData.deviceId = req.query.deviceId;
    reqData.userId = req.query.userId;
    reqData.itemId = req.query.itemId;
    if (reqData.deviceId || reqData.userId) {
        var matchQuery = {};
        if (reqData.userId) {
            matchQuery["userId"] = reqData.userId;
        } else if (reqData.deviceId) {
            matchQuery["deviceId"] = reqData.deviceId;
        }
        console.log(reqData);
        Cart.update(
            matchQuery,
            {
                "$pull": { "items": { "bongId": new ObjectId(reqData.itemId) } },
                "$currentDate": {
                    "updated": true
                }
            },
            function (err, removeInfo) {
                if (err) {
                    console.log(err);
                    res.status(400).json({ "status": "error" });
                } else {
                    res.json({ "status": "success", "itemId": reqData.itemId });
                }
            });
    } else {
        res.json({ "status": "error", "message": "invalid inputs" });
    }

});

router.get('/details', (req, res) => {
    if (req.query.deviceId || req.query.userId) {
        cartDAO.getCart(req.query, function (err, cart) {
            if (err) {
                res.status(400).json({ "status": "error" });
            } else {
                res.json(cart);
            }
        });
    } else {
        res.status(400).json({ "status": "error", "message": "invalid inputs" });
    }
});

router.post('/mergeCarts', function (req, res) {
    if (req.body.userId && req.body.deviceId) {
        var queries = {
            "userCart": { "userId": req.body.userId },
            "deviceCart": { "deviceId": req.body.deviceId }
        };
        async.mapValues(
            queries,
            function (query, cartType, done) {
                Cart.findOne(query, function (err, cartDetails) {
                    done(err, cartDetails);
                });
            }, function (err, results) {
                if (err) {
                    res.status(400).json({ "status": "error", "message": "Failed to merge carts" });
                } else {
                    if (results.userCart && results.deviceCart) {
                        _.each(results.deviceCart.items, function (item) {
                            var mergeItem = _.find(results.userCart.items, function (userItem) {
                                return userItem.bongId.equals(item.bongId);
                            });

                            if (mergeItem) {
                                mergeItem.quantity = mergeItem.quantity + item.quantity;
                            } else {
                                if (!results.userCart.items) {
                                    results.userCart.items = [];
                                }
                                results.userCart.items.push(item);
                            }
                        });

                        Cart.update(
                            { "userId": results.userCart.userId },
                            {
                                $set: { "items": results.userCart.items },
                                $currentDate: {
                                    "updated": true
                                }
                            },
                            function (err, cart) {
                                if (err) {
                                    console.log(err);
                                    res.status(400).json({ "status": "error", "message": "Failed to merge carts" });
                                } else {
                                    Cart.findOneAndRemove(
                                        {
                                            "deviceId": results.deviceCart.deviceId
                                        },
                                        function (err, cart) {
                                            if (err) {
                                                console.log("Device Cart with id - " + results.deviceCart.deviceId + " deleted failed");
                                            } else {
                                                console.log("Device Cart with id - " + results.deviceCart.deviceId + " deleted Succcessfully");
                                            }
                                        });
                                    res.json({ "status": "success", "message": "Carts merged successfully" });
                                }
                            });
                    } else if (results.deviceCart && results.deviceCart.items) {
                        Cart.findOneAndUpdate(
                            { "userId": req.body.userId },
                            {
                                "items": results.deviceCart.items,
                                'updated': new Date().toISOString(),
                                "userId": req.body.userId,
                                "deviceId": null
                            }, {
                                upsert: true,
                                setDefaultsOnInsert: true,
                                new: true,
                                runValidators: true
                            }, function (err, cart) {
                                if (err) {
                                    console.log(err);
                                    res.status(400).json({ "status": "error", "message": "Failed to merge carts" });
                                } else {
                                    Cart.findOneAndRemove(
                                        {
                                            "deviceId": results.deviceCart.deviceId
                                        },
                                        function (err, cart) {
                                            if (err) {
                                                console.log("Device Cart with id - " + results.deviceCart.deviceId + " deleted failed");
                                            } else {
                                                console.log("Device Cart with id - " + results.deviceCart.deviceId + " deleted Succcessfully");
                                            }
                                        });
                                    res.json({ "status": "success", "message": "Carts merged successfully" });
                                }
                            });
                    } else {
                        res.status(400).json({ "status": "error", "message": "invalid inputs" });
                    }
                }
            })
    } else {
        res.status(400).json({ "status": "error", "message": "invalid inputs" });
    }
});

router.get('/itemDetails',function(req,res){
    var query = {};
    
    if(req.query.userId){
        query["userId"] = req.query.userId;
    }
    if(req.query.deviceId){
        query.deviceId = req.query.deviceId;
    }
    if((query.deviceId || query.userId) && req.query.itemId){
        Cart.findOne(query, function (err, cart) {
            if (err) {
                res.status(400).json({ "status": "error", "message": "Failed to get item details","error":err });
            } else {
                if(cart){
                    var item = _.find(cart.items,function(item){return item.bongId.equals(req.query.itemId)});
                    if(item){
                        res.json(item);
                    } else {
                        res.status(404).json({ "status": "error", "message": "item not found" });    
                    }
                } else {
                    res.status(404).json({ "status": "error", "message": "Cart not found" });
                }
            }
        });
    } else {
        res.status(400).json({ "status": "error", "message": "invalid inputs" });
    }
})
module.exports = router;
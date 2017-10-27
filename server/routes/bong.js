/**
 * Created by SESA435400 on 4/29/2017.
 */
'use strict';

const express = require('express');
const router = express.Router();
const bong = require('../models/bong');
const extend = require('extend');
const _ = require('underscore');
const WhishList = require('../models/whishlist');
const Cart = require('../models/cart');
const async = require('async');

router.post('/create', (req, res, next) => {
    let newBong = new bong(req.body);
    newBong.save((err, bong) => {
        if (err) {
            res.json({ status: 'error' });
        }
        else {
            res.json(bong);
        }
    });
});


router.post('/list', (req, res, next) => {
    var conditionalQery = {};
    var skip = 0;
    var query = [];
    var matchQuery = {
        "$match": {
        }
    };
    var sortQuery = { $sort: {} };
    try {
        var reqQuery = req.body;
        console.log(reqQuery);
        if ((reqQuery.matchBy && typeof reqQuery.matchBy.discount === "number") || (reqQuery.sortBy && (reqQuery.sortBy.discount === 1 || reqQuery.sortBy.discount === -1))) {
            query.push({
                "$addFields": {
                    "discount": {
                        "$multiply": [
                            {
                                "$divide": [
                                    "$price",
                                    "$originalPrice"
                                ]
                            },
                            100
                        ]
                    }
                }
            });
            matchQuery.$match.discount = { $gte: reqQuery.matchBy.discount };
        }
        if (reqQuery.matchBy && reqQuery.matchBy.brands && Array.isArray(reqQuery.matchBy.brands) && reqQuery.matchBy.brands.length) {
            matchQuery.$match.brand = { "$in": reqQuery.matchBy.brands };
        }
        if (Object.keys(matchQuery.$match).length > 0) {
            query.push(matchQuery);
        }
        if (reqQuery.sortBy) {
            _.each(reqQuery.sortBy, function (val, key) {
                console.log(val, key);
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
        console.log("query",query);
        bong.aggregate(query, (err, bongs) => {
            if (err) {
                res.json({ status: 'error' });
            }
            else {
                if(req.body.userId){
                    // Finding whether it is in cart or whishlist
                    async.parallel({
                        cart: function (done) {
                            Cart.findOne({ "userId": req.body.userId }, function (err, cart) {
                                if (err) {
                                    done(err);
                                } else {
                                    done(null, cart);
                                }
                            });
                        },
                        whishlist: function (done) {
                            WhishList.findOne({ "userId": req.body.userId }, function (err, whishlist) {
                                if (err) {
                                    done(err);
                                } else {
                                    done(null, whishlist);
                                }
                            });
                        }
                    }, function (err, result) {
                        if(err){
                            res.status(400).json({ status: 'error' });
                        } else{
                            _.each(bongs, function (bong) {
                                bong.inCart = _.find(result.cart && result.cart.items, function (item) { return bong._id.equals(item.bongId) }) ? true : false;
                                bong.inWhishlist = _.find(result.whishlist && result.whishlist.items, function (item) { return bong._id.equals(item.bongId) }) ? true : false;
                                _.each(bong.images, function (image) {
                                    image.imageUrl = image.url + "s/" + image.file.name;
                                });
                            });
                            res.json(bongs);
                        }
                    });
                } else if(req.body.deviceId){
                    // Finding whether it is in cart or not
                    Cart.findOne({ "deviceId": req.body.deviceId }, function (err, cart) {
                        if (err) {
                            res.json({ status: 'error' });
                        } else {
                            _.each(bongs, function (bong) {
                                bong.inCart = _.find(cart && cart.items, function (item) { return bong._id.equals(item.bongId) }) ? true : false;
                                bong.inWhishlist = false;
                                _.each(bong.images, function (image) {
                                    image.imageUrl = image.url + "s/" + image.file.name;
                                });
                            });
                            res.json(bongs);
                        }
                    });
                } else {
                    _.each(bongs, function (bong) {
                        _.each(bong.images, function (image) {
                            image.imageUrl = image.url + "s/" + image.file.name;
                        });
                    });
                    res.json(bongs);
                }
            }
        });
    } catch (e) {
        res.json({ status: 'error' });
    }
});


router.get('/brands', (req, res, next) => {
    bong.find().distinct('brand', (err, bongs) => {
        if (err) {
            res.json({ status: 'error' });
        }
        else {
            res.json(bongs);
        }
    });
});

router.get('/:id', (req, res, next) => {
    bong.find({ _id: req.params.id }, (err, bong) => {
        if (err) {
            res.json({ status: 'error' });
        }
        else {
            res.json(bong);
        }
    });
});


router.delete('/:id', (req, res, next) => {
    bong.remove({ _id: req.params.id }, (err, bong) => {
        if (err) {
            res.json({ status: 'error' });
        }
        else {
            res.json(bong);
        }
    });
});

router.put('/update/:id', (req, res, next) => {
    bong.findOneAndUpdate({ _id: req.params.id }, req.body, (err, bong) => {
        if (err) {
            res.json({ status: 'error' });
        }
        else {
            res.json({ status: 'Bong is updated successfully' });
        }
    });
});

router.get('/refine/data', (req, res, next) => {
    var discounts = [];
    bong.aggregate([{ $project: { _id: 1, price: 1, originalPrice: 1, discount: { $multiply: [{ $floor: { $divide: [{ $multiply: [{ $divide: ["$price", "$originalPrice"] }, 100] }, 10] } }, 10] } } }, { $group: { _id: "$discount", total: { $sum: 1 } } }, { $sort: { "_id": 1 } }]).exec((err, discounts) => {
        if (err) {
            res.json({ status: 'error' });
        }
        else {
            bong.aggregate([{ $group: { _id: "$brand", total: { $sum: 1 } } }]).exec((err, brands) => {
                if (err) {
                    res.json({ status: 'error' });
                }
                else {
                    var discountsLen = discounts.length;
                    _.each(discounts, function (discount, index) {
                        for (var i = index + 1; i < discountsLen; i++) {
                            discount.total += discounts[i].total;
                        }
                    })
                    res.json({ Discounts: discounts, Brands: brands });
                }
            });
        }
    });
});

router.post('/bulkUpload',function(req,res){
    console.log(req.body);
    res.json({"status":"success"});
})

module.exports = router;
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
const downloader = require('image-downloader');
const uuid = require('uuid');
const config = require('../configuration/config.json');
const productDAO = require('../daos/productDAO');
router.post('/create', (req, res, next) => {
    let newBong = new bong(req.body);
    newBong.save((err, bong) => {
        if (err) {
            res.status(400).json({ status: 'error' });
        }
        else {
            res.json(bong);
        }
    });
});


router.post('/list', (req, res, next) => {
    productDAO.getBongs(req.body,(err,bongs) => {
        if(err){
            res.status(400).json({"status":"error"});
        } else {
            res.send(bongs);
        }
    });
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

router.get('/home',function(req,res){
    async.parallel({
        discounts:function(done){
            var reqQuery = {
                "userId":req.query.userId,
                "deviceId":req.query.deviceId,
                "sortBy":{
                    "discount":-1
                },
                "skip":0,
                "limit":10
            }
            productDAO.getBongs(reqQuery, (err, bongs) => {
                done(err,bongs);
            });
        },
        latestItems:function(done){
            var reqQuery = {
                "userId":req.query.userId,
                "deviceId":req.query.deviceId,
                "sortBy":{
                    "time":-1
                },
                "skip":0,
                "limit":10
            }
            productDAO.getBongs(reqQuery, (err, bongs) => {
                done(err,bongs);
            });
        }
    },function(err,result){
        if(err){
            res.status(400).json({"status":"error","error":err});
        } else {
            res.json(result);
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
            res.status(400).json({ status: 'error' });
        }
        else {
            res.json(bong);
        }
    });
});

router.put('/update/:id', (req, res, next) => {
    bong.findOneAndUpdate({ _id: req.params.id }, req.body, (err, bong) => {
        if (err) {
            res.status(400).json({ status: 'error' });
        }
        else {
            res.json({ status: 'Bong is updated successfully' });
        }
    });
});

router.get('/refine/data', (req, res, next) => {
    var discounts = [];
    var discountExpression = {
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
    };
    bong.aggregate([{ $project: { _id: 1, price: 1, originalPrice: 1, discount: { $multiply: [{ $floor: { $divide: [discountExpression, 10] } }, 10] } } }, { $group: { _id: "$discount", total: { $sum: 1 } } }, { $sort: { "_id": 1 } }]).exec((err, discounts) => {
        if (err) {
            res.status(400).json({ status: 'error' });
        }
        else {
            bong.aggregate([{ $group: { _id: "$brand", total: { $sum: 1 } } }]).exec((err, brands) => {
                if (err) {
                    res.status(400).json({ status: 'error' });
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

router.post('/bulkUpload', function (req, res) {
    var rawBongs = req.body;
    var parsedBongs = [];
    async.mapValues(rawBongs, function (value, key, callback) {
        var images = value.images.split(',');
        async.mapValues(images, function (value, key, imageCallback) {
            try {
                var fileName = 'uploads/' + (uuid()) + '-' + key + '-' + value.substring(value.lastIndexOf('/') + 1, value.lastIndexOf('.')) + value.substr(value.lastIndexOf('.'), value.length);
                //fs.openSync(fileName,'w');
                var options = {
                    url: value,
                    dest: fileName,        // Save to /path/to/dest/photo.jpg
                    done: function (err, filename, image) {
                        imageCallback(err, { relativeURL: filename })
                    }
                }
                downloader(options);
            } catch (e) {
                imageCallback(e);
            }

        }, function (err, results) {
            var parsedBong = JSON.parse(JSON.stringify(value));
            parsedBong.images = [];
            _.each(results, function (value) {
                parsedBong.images.push(value);
            });
            parsedBongs.push(parsedBong);
            callback(err, results)
        })
    }, function (err, results) {
        if (err) {
            res.status(400).json({ "status": "error", "error": err });
        } else {
            bong.create(parsedBongs, function (err, results) {
                if (err) {
                    res.status(400).json({ "status": "error", "error": err });
                } else {
                    res.json({ "status": "success" });
                }
            });
        }
    })
})
module.exports = router;
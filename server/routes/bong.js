/**
 * Created by SESA435400 on 4/29/2017.
 */
'use strict';

const express = require('express');
const router = express.Router();
const bong = require('../models/bong');
const extend = require('extend');
const _ = require('lodash');

router.post('/create', (req, res, next) => {
    let newBong = new bong(req.body);
    newBong.save((err, bong) => {
        if (err) {
            res.json({ status: 'failure' });
        }
        else {
            res.json(bong);
        }
    });
});


router.get('/list', (req, res, next) => {
    var conditionalQery = {};
    var skip = 0;
    var query = [];
    var matchQuery = {
        "$match": {
        }
    };
    var sortQuery = { $sort: {} };
    if (req.query.query) {
        try {
            var reqQuery = JSON.parse(req.query.query);
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
                console.log(reqQuery.sortBy);
                _.forEach(reqQuery.sortBy, function (val, key) {
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
            bong.aggregate(query).exec((err, bongs) => {
                if (err) {
                    res.json({ status: 'failure' });
                }
                else {
                    _.forEach(bongs, function (bong) {
                        _.forEach(bong.images, function (image) {
                            image.imageUrl = image.url + "s/" + image.file.name;
                        })
                    });
                    res.json(bongs);
                }
            });
        } catch (e) {
            res.json({ status: 'failure' });
        }

    } else {
        bong.find({}).exec((err, bongs) => {
            if (err) {
                res.json({ status: 'failure' });
            }
            else {
                _.forEach(bongs, function (bong) {
                    _.forEach(bong.images, function (image) {
                        image.imageUrl = image.url + "s/" + image.file.name;
                    })
                });
                res.json(bongs);
            }
        });
    }
});


router.get('/brands', (req, res, next) => {
    bong.find().distinct('brand', (err, bongs) => {
        if (err) {
            res.json({ status: 'failure' });
        }
        else {
            res.json(bongs);
        }
    });
});

router.get('/:id', (req, res, next) => {
    bong.find({ _id: req.params.id }, (err, bong) => {
        if (err) {
            res.json({ status: 'failure' });
        }
        else {
            res.json(bong);
        }
    });
});


router.delete('/:id', (req, res, next) => {
    bong.remove({ _id: req.params.id }, (err, bong) => {
        if (err) {
            res.json({ status: 'failure' });
        }
        else {
            res.json(bong);
        }
    });
});

router.put('/update/:id', (req, res, next) => {
    bong.findOneAndUpdate({ _id: req.params.id }, req.body, (err, bong) => {
        if (err) {
            res.json({ status: 'failure' });
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
            res.json({ status: 'failure' });
        }
        else {
            bong.aggregate([{ $group: { _id: "$brand", total: { $sum: 1 } } }]).exec((err, brands) => {
                if (err) {
                    res.json({ status: 'failure' });
                }
                else {
                    var discountsLen = discounts.length;
                    _.forEach(discounts, function (discount, index) {
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

module.exports = router;
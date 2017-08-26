'use strict';
const express = require('express');
const router = express.Router();
const WhishList = require('../models/whishlist');
const _ = require('underscore');
const mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
router.post('/addItem', (req, res) => {
    var reqData = {
        "userId": req.body.userId,
        "itemId": req.body.itemId
    }
    if (reqData.userId && reqData.itemId) {
        WhishList.findOne({ userId: reqData.userId }, function (err, whishList) {
            if (err) {
                res.json({ "status": "error" });
            } else {
                if (whishList && _.find(whishList.items, function (item) {
                    return item.bongId && item.bongId.equals(reqData.itemId)
                })) {
                    res.json({ "status": "error", "message": "Item already in whishlist" });
                } else {
                    WhishList.findOneAndUpdate(
                    { userId: reqData.userId },
                    {
                        "$push": { "items": { "bongId": reqData.itemId } },
                        "$currentDate": {
                            "updated": true
                        },
                        "userId": reqData.userId
                    }, {
                        upsert: true,
                        setDefaultsOnInsert: true,
                        new: true,
                        runValidators: true
                    }, function (err, whishList) {
                        if (err) {
                            console.log(err);
                            res.json({ "status": "error","error":err });
                        } else {
                            res.json(whishList);
                        }
                    });
                }
                
            }
        });
    } else {
        res.json({ "status": "error", "message": "invalid inputs" });
    }
});

router.delete('/removeItem', (req, res) => {
    var reqData = {};
    reqData.userId = req.query.userId;
    reqData.itemId = req.query.itemId;
    if (reqData.userId) {
        var matchQuery = {};
        matchQuery["userId"] = reqData.userId;
        console.log(reqData);
        WhishList.update(
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
                    res.json({ "status": "error" });
                } else {
                    res.json({ "status": "success", "itemId": reqData.itemId });
                }
            });
    } else {
        res.json({ "status": "error", "message": "invalid inputs" });
    }

});

router.get('/details', (req, res) => {
    if (req.query.userId) {
        getWhishList(req.query, function (err, whishList) {
            if (err) {
                res.json({ "status": "error" });
            } else {
                res.json(whishList);
            }
        });
    } else {
        res.json({ "status": "error", "message": "invalid inputs" });
    }
});

function getWhishList(reqData, callback) {
    var matchQuery = { "$match": {} };
    matchQuery["$match"]["userId"] = new ObjectId(reqData.userId); 
    WhishList.aggregate([
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
        }], function (err, whishlist) {
            if (err) {
                callback(err);
            } else {
                if (whishlist && whishlist[0]) {
                    _.each(whishlist[0].products, function (bong) {
                        _.each(bong.images, function (image) {
                            image.imageUrl = image.url + "s/" + image.file.name;
                        })
                    });
                }
                callback(null, whishlist);
            }
        });
}
module.exports = router;
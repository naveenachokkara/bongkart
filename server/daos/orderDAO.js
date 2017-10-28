'use strict';
const express = require("express");
const mongoose = require('mongoose');
const _ = require('underscore');
const router = express.Router();
const Order = require('../models/order');
const ObjectId = mongoose.Types.ObjectId;
module.exports = {
    getOrder:function(orderId,callback){
        var aggregateQuery = [{ "$match": {"_id":new ObjectId(orderId)} }];
        var productJoinQuery = [
            {
                "$unwind": {
                    "path": "$items",
                    "preserveNullAndEmptyArrays": true
                }
            },
            {
                "$lookup": {
                    "from": "bongs",
                    "localField": "items.bongId",
                    "foreignField": "_id",
                    "as": "product"
                }
            },
            {
                "$unwind": "$product"
            },
            {
                "$group": {
                    "_id": "$_id",
                    "userId": {
                        "$first": "$userId"
                    },
                    "address": {
                        "$first": "$address"
                    },
                    "paymentMethod": {
                        "$first": "$paymentMethod"
                    },
                    "status": {
                        "$first": "$status"
                    },
                    "expectedDeliveryDate": {
                        "$first": "$expectedDeliveryDate"
                    },
                    "deliveryDate": {
                        "$first": "$deliveryDate"
                    },
                    "tax": {
                        "$first": "$tax"
                    },
                    "totalAmount": {
                        "$first": "$totalAmount"
                    },
                    "updated" : {
                        "$first": "$updated"
                    },
                    "created" : {
                        "$first": "$created"
                    },
                    "items": {
                        "$push": "$items"
                    },
                    "products": {
                        "$push": "$product"
                    }
                }
            }
        ];
        aggregateQuery = aggregateQuery.concat(productJoinQuery);
        Order.aggregate(aggregateQuery, function (err, orders) {
            if (err) {
                callback(err,null)
            } else {
                if (orders && orders.length) {
                    _.each(orders, function (order) {
                        _.each(order.products, function (bong) {
                            _.each(bong.images, function (image) {
                                if (image.relativeURL) {
                                    image.imageUrl = config.serverURI + image.relativeURL;
                                } else {
                                    image.imageUrl = image.url + "s/" + image.file.name;
                                }
                            })
                        });
                    });
                    callback(null,orders[0]);
                } else {
                    callback(null, null);
                }
            }
        });
    }
}
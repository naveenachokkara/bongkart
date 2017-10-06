/**
 * Created by SESA435400 on 5/10/2017.
 */
'use strict';
const express = require("express");
const mongoose = require('mongoose');
const router = express.Router();
const Order = require('../models/order');
const Cart = require('../models/cart');
const _ = require('underscore');
var ObjectId = mongoose.Types.ObjectId;
const orderDAO = require('../daos/orderDAO');
const orderMailController = require('./orderMailController');

router.post('/placeOrder',(req,res,next) => {
    if(req.body.userId && req.body.address && req.body.expectedDeliveryDate){
        if(req.body.items){
            var items = [];
            var totalAmount = 0;
            var products = [];
            var orderObj = {
                "userId": req.body.userId,
                "address": req.body.address,
                "paymentMethod": null,
                "status": "pending",
                "expectedDeliveryDate": new Date(req.body.expectedDeliveryDate),
                "deliveryDate": null,
                "tax": 0
            }
            _.each(req.body.items,function(item){
                totalAmount += (item.price * item.quantity);
                items.push({
                    "bongId": item.bongId,
                    "quantity": item.quantity,
                    "price": item.price,
                    "originalPrice": item.originalPrice,
                    "status": "pending"
                });
            })
            if (items.length) {
                orderObj.totalAmount = totalAmount;
                orderObj.items = items;
                let newOrder = new Order(orderObj);
                newOrder.save((err, order) => {
                    if (err) {
                        res.json({ "status": "error", message: "Order creation error", error: err });
                    } else {
                        Cart.findOneAndRemove(
                                {
                                    "userId": req.body.userId
                                },
                                function (err, cart) {
                                    console.log(cart);
                                    if (err) {
                                        console.log("User Cart with id - " + carts[0]._id + " deleted failed - userId - " + req.body.userId);
                                    } else {
                                        console.log("User Cart with id - " + carts[0]._id + " deleted Succcessfully - userId" + req.body.userId);
                                    }
                                });
                        orderMailController.sendConfirmOrderMail(order._id);
                        res.json(order);
                    }
                });
            } else{
                res.json({ "status": "error", "message": "invalid inputs" });   
            }
        } else {
            getCartDetails(req.body, function (err, carts) {
                if (err) {
                    res.json({ "status": "error", "error": err });
                } else if (carts && carts.length) {
                    var items = [];
                    var totalAmount = 0;
                    var products = [];
                    var orderObj = {
                        "userId": req.body.userId,
                        "address": req.body.address,
                        "paymentMethod": null,
                        "status": "pending",
                        "expectedDeliveryDate": new Date(req.body.expectedDeliveryDate),
                        "deliveryDate": null,
                        "tax": 0
                    }
                    _.each(carts[0].items, function (item) {
                        var product = _.find(carts[0].products, function (product) {
                            return product._id.equals(item.bongId);
                        });
                        if (product) {
                            totalAmount += (product.price * item.quantity);
                            items.push({
                                "bongId": item.bongId,
                                "quantity": item.quantity,
                                "price": product.price,
                                "originalPrice": product.originalPrice,
                                "status":"pending"
                            });
                            products.push(product);
                        }
                    });
                    orderObj.totalAmount = totalAmount;
                    orderObj.items = items;
                    let newOrder = new Order(orderObj);
                    newOrder.save((err, order) => {
                        if (err) {
                            res.json({ "status": "error", message: "Order creation error", error: err });
                        } else {
                            // order = JSON.parse(JSON.stringify(order))
                            // order.products = products;
                            Cart.findOneAndRemove(
                                {
                                    "_id": carts[0]._id
                                },
                                function (err, cart) {
                                    console.log(cart);
                                    if (err) {
                                        console.log("User Cart with id - " + carts[0]._id + " deleted failed - userId - " + req.body.userId);
                                    } else {
                                        console.log("User Cart with id - " + carts[0]._id + " deleted Succcessfully - userId" + req.body.userId);
                                    }
                                });
                            orderMailController.sendConfirmOrderMail(order._id);
                            res.json(order);
                        }
                    });
                } else {
                    res.json({ "status": "error", "message": "Cart not found" });
                }
            });
        }
        
    } else {
        res.json({ "status": "error", "message": "invalid inputs" });
    }
});


router.get('/list',(req,res,next) => {
    if(req.query.userId){
        var aggregateQuery = [{ "$match": {"userId":new ObjectId(req.query.userId)} },{"$sort": {"created": -1}}];
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
        if(req.query.skip){
            aggregateQuery.push({"$skip": parseInt(req.query.skip)});
        }
        if(req.query.limit){
            aggregateQuery.push({"$limit": parseInt(req.query.limit)});
        }
        aggregateQuery = aggregateQuery.concat(productJoinQuery);
        Order.aggregate(aggregateQuery, function (err, orders) {
                if (err) {
                    res.json({ "status": "error",message:"Failed to fetch user Orders",error:err });
                } else {
                    if (orders && orders.length) {
                        _.each(orders, function (order) {
                            _.each(order.products, function (bong) {
                                _.each(bong.images, function (image) {
                                    image.imageUrl = image.url + "s/" + image.file.name;
                                })
                            });
                        });
                    }
                    res.json(orders)
                }
            });
    }  else {
        res.json({ "status": "error", "message": "invalid inputs" });
    }
});


router.get("/:id", (req, res, next) => {
    if (req.params.id) {
        orderDAO.getOrder(req.params.id, function (err, order) {
            if (err) {
                res.json({ "status": "error", "message": "Error getting order" });
            } else if (order) {
                res.json(order);
            } else {
                res.status(404).json({ "status": "success", "message": "Order not found" });
            }
        });
    } else {
        res.json({ "status": "error", "message": "invalid inputs" });
    }
});

router.put('/update/:id',(req,res,next) => {
    order.findOneAndUpdate({_id:req.params.id},req.body,(err,order) => {
        if(err){
          res.json({"status":"something went wrong when updating the order"});
        }
        else{
          res.json({"status":"order updated successfully"});
        }

    });
});

router.delete("/delete/:id",(req,res,next) =>{
    order.remove({_id:req.params.id},(err) => {
        if(err){
            res.json({"status":"something went wrong while delete the order"});
        }
        else{
            res.json({"status":"successfully deleted order"});
        }
    });
});
function getCartDetails(reqData, callback) {
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
                            image.imageUrl = image.url + "s/" + image.file.name;
                        })
                    });
                }
                callback(null, cart);
            }
        });
}
module.exports = router;

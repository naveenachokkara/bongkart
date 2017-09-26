/**
 * Created by SESA435400 on 5/10/2017.
 */
'use strict';
const express = require("express");
const mongoose = require('mongoose');
const router = express.Router();
const order = require('../models/order');
const Cart = require('../models/cart');
const _ = require('underscore');
var ObjectId = mongoose.Types.ObjectId;
router.post('/placeOrder',(req,res,next) => {
    if(req.body.userId && req.body.addressId && req.body.expectedDeliveryDate){
        getCartDetails(req.body,function(err,carts){
            if(err){
                res.json({ "status": "error", "error": err });
            } else if(carts && carts.length){
                var items = [];
                var totalAmount = 0;
                var products = [];
                var orderObj = {
                    "userId": req.body.userId,
                    "addressId": req.body.addressId,
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
                        totalAmount += product.price;
                        items.push({
                            "bongId": item.bongId,
                            "quantity": item.quantity,
                            "price": product.price,
                            "originalPrice": product.originalPrice
                        });
                        products.push(product);
                  }
                });
                orderObj.totalAmount = totalAmount;
                orderObj.items = items;
                let newOrder = new order(orderObj);
                newOrder.save((err, order) => {
                    if (err) {
                        res.json({ "status": "error", message: "Order creation error", error: err });
                    } else {
                        order = JSON.parse(JSON.stringify(order))
                        order.products = products;
                        Cart.findOneAndRemove(
                            {
                                "_id": carts[0]._id
                            },
                            function (err, cart) {
                                console.log(cart);
                                if (err) {
                                    console.log("User Cart with id - " + carts[0]._id + " deleted failed - userId - "+ req.body.userId);
                                } else {
                                    console.log("User Cart with id - " + carts[0]._id + " deleted Succcessfully - userId"+ req.body.userId);
                                }
                            });
                        res.json(order);
                    }
                });
            } else {
                res.json({ "status": "error", "message": "Cart not found" });
            }
        });
    } else {
        res.json({ "status": "error", "message": "invalid inputs" });
    }
});


router.get('/list',(req,res,next) => {
    order.find({},(err,orders) => {
        if(err){
            res.json({"status":"something went wrong while getting the orders"});
        }
        else{
            res.json(orders);
        }
    });
});


router.get("/:id",(req,res,next) => {
    order.find({_id:req.params.id},(err,order) => {
        if(err){
            res.json({"status":"something went wrong to get order details"});
        }
        else{
            res.json(order);
        }
    });

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

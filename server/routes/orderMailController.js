'use strict';
const orderDAO = require('../daos/orderDAO');
const User = require('../models/user');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const orderTemplates = require('../utils/orderTemplates');
const mailer = require('../utils/mailer');
module.exports = {
    sendConfirmOrderMail:function(orderId){
        orderDAO.getOrder(orderId,function(err,order){
            if(err){
                console.log("Failed to send confirmation email for order ID - "+orderId);
            } else if(order) {
                User.findOne({"_id":new ObjectId(order.userId)},function(userErr,user){
                    if(userErr){
                        console.log("Failed to send confirmation email for order ID - "+orderId);
                    } else if(user){
                        var html = orderTemplates.getOrderConformation(user,order);
                        var subject = "Order Confirmation - Your Order with Bongkart ["+orderId+"] has been successfully placed!";
                        var sendersMails = [user.email];
                        mailer.sendMail(sendersMails,subject,html);
                    } else {
                        console.log("Failed to send confirmation email for order ID - "+orderId);
                    }
                });
            }  else {
                console.log("Failed to send confirmation email for order ID - "+orderId);
            }
        });
    },
    sendCancelOrderedItemsMail:function(orderId,cancelledItems){
        orderDAO.getOrder(orderId,function(err,order){
            if(err){
                console.log("Failed to send cancel order items email for order ID - "+orderId);
            } else if(order) {
                User.findOne({"_id":new ObjectId(order.userId)},function(userErr,user){
                    if(userErr){
                        console.log("Failed to send cancel order items email for order ID - "+orderId);
                    } else if(user){
                        var html = orderTemplates.getCancelOrderedItems(user,order,cancelledItems);
                        var subject = "Cancellation of your Order "+ order._id +" with BongKart";
                        var sendersMails = [user.email];
                        mailer.sendMail(sendersMails,subject,html);
                    } else {
                        console.log("Failed to send cancel order items email for order ID - "+orderId);
                    }
                });
            }  else {
                console.log("Failed to send cancel order items email for order ID - "+orderId);
            }
        });
    }
};
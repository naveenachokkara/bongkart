/**
 * Created by SESA435400 on 5/10/2017.
 */
'use strict';
const express = require("express");
const router = express.Router();
const order = require('../models/order');

router.post('/create',(req,res,next) => {
    let newOrder = new order(req.body);
    newOrder.save((err,order) => {
        if(err){
            res.json(err);
        }
        else{
            res.json(order);
        }
    });
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

module.exports = router;

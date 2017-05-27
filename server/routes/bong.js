/**
 * Created by SESA435400 on 4/29/2017.
 */
'use strict';

const express = require('express');
const router = express.Router();
const bong = require('../models/bong');
const extend = require('extend');

router.post('/create',(req,res,next) => {
    let newBong = new bong(req.body);
    newBong.save((err,bong) => {
        if(err){
            res.json({status:'failure'});
        }
        else{
            res.json(bong);
         }
    });
});


router.get('/list',(req,res,next) => {
    var conditionalQery = {};
    if(typeof req.query.latest !== 'undefined'){
        var query = {'created':-1};
        extend(conditionalQery,query);
    }
    if(typeof req.query.priceHighToLow !== 'undefined'){
        var query = {'price':-1};
        extend(conditionalQery,query);
    }
    if(typeof req.query.priceLowToHigh !== 'undefined'){
        var query = {'price':1};
        extend(conditionalQery,query);
    }
    console.log(conditionalQery);
    bong.find().sort(conditionalQery).exec((err, bongs) => {
        if(err){
            res.json({status:'failure'});
        }
        else{
            res.json(bongs);
        }
    });
});


router.get('/brands',(req,res,next) => {
    bong.find().sort('-created').select('brand').exec((err, bongs) => {
    if(err){
        res.json({status:'failure'});
    }
    else{
        res.json(bongs);
    }
});
});

router.get('/:id',(req,res,next) => {
    bong.find({_id:req.params.id},(err,bong) => {
    if(err){
        res.json({status:'failure'});
    }
    else{
        res.json(bong);
}
});
});


router.delete('/:id',(req,res,next) => {
    bong.remove({_id:req.params.id},(err,bong) => {
    if(err){
        res.json({status:'failure'});
    }
    else{
        res.json(bong);
}
});
});

router.put('/update/:id',(req,res,next) => {
    bong.findOneAndUpdate({_id:req.params.id},req.body,(err,bong) => {
        if(err){
            res.json({status:'failure'});
        }
        else{
            res.json({status:'Bong is updated successfully'});
         }
    });
});

module.exports = router;
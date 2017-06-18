/**
 * Created by SESA435400 on 4/29/2017.
 */
'use strict';

const express = require('express');
const router = express.Router();
const bong = require('../models/bong');
const extend = require('extend');
const _ = require('lodash');

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
    var skip = 0;
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
    if(typeof req.query.startIndex !== 'undefined'){
        skip = req.query.startIndex;
    }
    bong.find().sort(conditionalQery).skip(Number(skip)).limit(5).exec((err, bongs) => {
        if(err){
            res.json({status:'failure'});
        }
        else{
            _.forEach(bongs,function(bong){
                _.forEach(bong.images,function(image){
                    image.imageUrl = image.url+"s/"+ image.file.name;
                })
             });
            res.json(bongs);
        }
    });
});


router.get('/brands',(req,res,next) => {
    bong.find().distinct('brand',(err, bongs) => {
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

router.get('/discount/percentages',(req,res,next) => {
    var discounts = [];
    bong.find().exec((err, bongs) => {
    if(err){
        res.json({status:'failure'});
    }
    else{
        _.forEach(bongs,function(bong){
           var discount = Number(bong.price) / Number(bong.originalPrice) * 100;
           discounts.push(Math.round(discount));
        });

        var maxPercentage = _.max(discounts, function (percentage) {
            return percentage;
        });

        var minPercentage = _.min(discounts, function (percentage) {
            return percentage;
        });
        res.json({data:{discounts:{max:maxPercentage,min:minPercentage},bongs:bongs}});
        // res.json(discounts);
    }
});
});

module.exports = router;
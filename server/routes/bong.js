/**
 * Created by SESA435400 on 4/29/2017.
 */
'use strict';

const express = require('express');
const router = express.Router();
const bong = require('../models/bong');

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
    bong.find({},(err,bongs) => {
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
'use strict';

const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Brand = require('../models/brand');
const _ = require('underscore');
var ObjectId = mongoose.Types.ObjectId;

router.post('/', function (req, res) {
    let newBrand = new Brand(req.body);
    newBrand.save((err, brand) => {
        if (err) {
            res.json({ "status": "error" ,message:"Brand creation error",error:err});
        } else {
            res.json(brand);
        }
    });
});

router.get('/:id', function (req, res) {
    Brand.findOne({ _id: req.params.id }, (err, brand) => {
        if (err) {
            res.json({ "status": "error" ,message:"Failed to fetch brand",error:err });
        } else {
            res.json(brand);
        }
    });
});
router.put('/:id', (req, res, next) => {
    req.body["$currentDate"] = {
        "updated": true
    };
    Brand.findOneAndUpdate({ _id: req.params.id}, req.body, {
        new: true,
        runValidators: true
    }, (err, brand) => {
        if (err) {
            res.json({ status: 'error', message:"Failed to update brand",error:err });
        }
        else {
            res.json(brand);
        }
    });
});
router.delete('/:id', function (req, res) {
    Brand.findOne({ _id: req.params.id }, (err, brand) => {
        if (err) {
            res.status(400).json({ "status": "error" ,message:"Failed to fetch brand",error:err });
        } else {
            if(brand){
                brand.remove((err, brand) => {
                    if (err) {
                        res.status(400).json({ "status": "error", message: "Failed to delete" });
                    } else {
                        res.json({ "status": "success", "brandId": req.params.id, message: "Brand deleted successfully" });
                    }
                });
            } else {
                res.status(404).json({ "status": "error" ,message:"Brand not found" });
            }
        }
    });
});
module.exports = router;
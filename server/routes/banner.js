'use strict';

const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Banner = require('../models/banner');
const _ = require('underscore');
var ObjectId = mongoose.Types.ObjectId;
const bannerDAO = require('../daos/bannerDAO');

router.post('/', function (req, res) {
    let newBanner = new Banner(req.body);
    newBanner.save((err, banner) => {
        if (err) {
            res.json({ "status": "error" ,message:"Banner creation error",error:err});
        } else {
            res.json(banner);
        }
    });
});

router.get('/list', function (req, res) {
   bannerDAO.getBanners((err, banners) => {
        if (err) {
            res.status(400).json({ "status": "error" ,message:"Failed to fetch banners",error:err });
        } else {
            res.json(banners);
        }
    });
});

router.get('/:id', function (req, res) {
    Banner.findOne({ _id: req.params.id }, (err, banner) => {
        if (err) {
            res.status(400).json({ "status": "error" ,message:"Failed to fetch banner",error:err });
        } else {
            res.json(banner);
        }
    });
});

router.put('/:id', (req, res, next) => {
    Banner.findOneAndUpdate({ _id: req.params.id}, {"$set":req.body,"$currentDate":{updated:true}}, {
        new: true,
        runValidators: true
    }, (err, banner) => {
        if (err) {
            res.status(400).json({ status: 'error', message:"Failed to update banner",error:err });
        }
        else {
            res.json(banner);
        }
    });
});
router.delete('/:id', function (req, res) {
    Banner.findOne({ _id: req.params.id }, (err, banner) => {
        if (err) {
            res.status(400).json({ "status": "error" ,message:"Failed to fetch banner",error:err });
        } else {
            if(banner){
                banner.remove((err, banner) => {
                    if (err) {
                        res.status(400).json({ "status": "error", message: "Failed to delete" });
                    } else {
                        res.json({ "status": "success", "bannerId": req.params.id, message: "Banner deleted successfully" });
                    }
                });
            } else {
                res.status(404).json({ "status": "error" ,message:"Banner not found" });
            }
        }
    });
});
module.exports = router;
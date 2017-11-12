'use strict';
const express = require("express");
const mongoose = require('mongoose');
const _ = require('underscore');
const router = express.Router();
const Banner = require('../models/banner');
const ObjectId = mongoose.Types.ObjectId;
const config = require('../configuration/config.json');
module.exports = {
    getBanners: function(callback){
        var brandQuery = [
            {
                "$lookup": {
                    "from": "brands",
                    "localField": "brandId",
                    "foreignField": "_id",
                    "as": "brands"
                }
            },
            {
                "$unwind": "$brands"
            },
            {
                "$addFields": {
                    "brand": "$brands.name"
                }
            }
        ];
        Banner.aggregate(brandQuery, (err, banners) => {
            callback(err,banners);
        });
    }
    
}
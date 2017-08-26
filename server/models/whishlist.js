'use strict';
const mongoose = require('mongoose');
const idvalidator = require('mongoose-id-validator');
const Schema = mongoose.Schema;
var WhishListSchema = mongoose.Schema({
    "userId": {type:Schema.Types.ObjectId, ref:'User'},
    "items":[{"bongId":{type: Schema.Types.ObjectId, ref: 'Bong', require:true}}],
    "created": {
        type: Date,
        default: Date.now
    },
    "updated": {
        type: Date,
        default: Date.now
    }
});
WhishListSchema.plugin(idvalidator);
const whishList = module.exports = mongoose.model("whishList",WhishListSchema);
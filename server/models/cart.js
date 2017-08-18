'use strict';
const mongoose = require('mongoose');
const idvalidator = require('mongoose-id-validator');
const Schema = mongoose.Schema;
var CartSchema = mongoose.Schema({
    "deviceId":{type:String,require:true},
    "userId":{type: Schema.Types.ObjectId, ref: 'User' },
    "items":[{"bongId":{type: Schema.Types.ObjectId, ref: 'Bong', require:true},"quantity":{type:Number,require:true}}],
    "created": {
        type: Date,
        default: Date.now
    },
    "updated": {
        type: Date,
        default: Date.now
    }    
});
CartSchema.plugin(idvalidator);
const cart = module.exports = mongoose.model("cart",CartSchema);

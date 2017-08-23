'use strict';
const mongoose = require('mongoose');
const idvalidator = require('mongoose-id-validator');
const Schema = mongoose.Schema;
var AdsressSchema = mongoose.Schema({
    "userId": { type: Schema.Types.ObjectId, ref: 'User', require: true },
    "pincode": { type: String },
    "name": { type: String },
    "address": { type: String },
    "city": { type: String },
    "phoneNumber": { type: String },
    "created": {
        type: Date,
        default: Date.now
    },
    "updated": {
        type: Date,
        default: Date.now
    }
});
AdsressSchema.plugin(idvalidator);
const address = module.exports = mongoose.model("address", AdsressSchema);
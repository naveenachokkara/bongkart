'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var CartSchema = mongoose.Schema({
    "deviceId":String,
    "user":{type: Schema.Types.ObjectId, ref: 'User' },
    "item":{type: Schema.Types.ObjectId, ref: 'Bong' },
    "created": {
        type: Date,
        default: Date.now
    }
});
const cart = module.exports = mongoose.model("cart",CartSchema);

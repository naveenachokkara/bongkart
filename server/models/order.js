'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var OrderSchema = mongoose.Schema({
    "created": {
        type: Date,
        default: Date.now
    },
    "updated": {
        type: Date,
        default: Date.now
    },    
    "userId":{type: Schema.Types.ObjectId, ref: 'User' },
    "address":Schema.Types.Mixed,
    "paymentMethod":String,
    "status": String,
    "expectedDeliveryDate": { type: Date }, 
    "deliveryDate": {type: Date},
    "tax": {type:Number,default:0},
    "totalAmount": Number, 
    "items": [
        {
            "bongId":{type: Schema.Types.ObjectId, ref: 'Bong', require:true},
            "quantity": {type:Number,require:true},
            "price": Number,
            "originalPrice": Number
        }
    ]
});
const order = module.exports = mongoose.model("order",OrderSchema);

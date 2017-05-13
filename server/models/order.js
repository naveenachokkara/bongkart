'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var OrderSchema = mongoose.Schema({
    "order":[{
        "items":[
            {
                "id":String,
                "expectedDeliveryDate":Date,
                "deliveryDate":Date,
                "status":String,
                "item":{type: Schema.Types.ObjectId, ref: 'Bong' }
            }
        ],
        "user":{type: Schema.Types.ObjectId, ref: 'User' }
    }]
});
const order = module.exports = mongoose.model("order",OrderSchema);

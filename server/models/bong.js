/**
 * Created by SESA435400 on 4/29/2017.
 */
const mongoose = require('mongoose');

const BongSchema = mongoose.Schema({
    "title":{
        type:String
    },
    "price":{
        type:Number
    },
    "originalPrice":{
        type:Number
    },
    "description":{
        type:String
    },
    "brand":{
        type:String
    },
    "modelNumber":{
        type:String
    },
    "functionType":{
        type:String
    },
    "material":{
        type:String
    },
    "color":{
        type:String
    },
    "jointSize":{
        type:Number
    },
    "diameter":{
        type:Number
    },
    "height":{
        type:Number
    },
    "images":{
        type:Array
    },
    "quantity":{
        type:Number
    }
});

const bong = module.exports = mongoose.model("Bong",BongSchema);
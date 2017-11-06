/**
 * Created by SESA435400 on 4/29/2017.
 */
const mongoose = require('mongoose');
const async = require('async');
const fs = require('fs');
const idvalidator = require('mongoose-id-validator');
const Schema = mongoose.Schema;

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
    "brandId":{
        type: Schema.Types.ObjectId, 
        ref: 'Brand', 
        require:true 
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
    },
    "created": {
        type: Date,
        default: Date.now
    }
});

BongSchema.pre('remove',function(next){
    async.each(this.images, function (image, callback) {
        if(image.relativeURL){
            fs.unlink(image.relativeURL, (err) => {
                callback();
            });
        } else {
            callback();
        }
    }, function (err, result) {
        next();
    });
});
BongSchema.plugin(idvalidator);
const bong = module.exports = mongoose.model("Bong",BongSchema);
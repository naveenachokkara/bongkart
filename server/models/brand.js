/**
 * Created by SESA435400 on 4/29/2017.
 */
const mongoose = require('mongoose');
const fs = require('fs');
const BrandSchema = mongoose.Schema({
    "name":{
        type:String,
        require:true
    },
    "image":{
        type:{"relativeURL":{type:String}}
    },
    "created": {
        type: Date,
        default: Date.now
    },
    "updated":{
        type: Date,
        default: Date.now
    }
});
BrandSchema.pre('remove',function(next){
    fs.unlink(this.image.relativeURL, (err) => {
        next();
    });
});
const bong = module.exports = mongoose.model("Brand",BrandSchema);
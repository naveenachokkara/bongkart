/**
 * Created by SESA435400 on 4/29/2017.
 */
const mongoose = require('mongoose');
const fs = require('fs');
const Schema = mongoose.Schema;
const BannerSchema = mongoose.Schema({
    "brandId":{
        type: Schema.Types.ObjectId, 
        ref: 'Brand', 
        require:true 
    },
    "item":{
        type: String
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
BannerSchema.pre('remove',function(next){
    fs.unlink(this.image.relativeURL, (err) => {
        next();
    });
});
const bong = module.exports = mongoose.model("Banner",BannerSchema);
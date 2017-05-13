/**
 * Created by SESA435400 on 5/1/2017.
 */
const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
   "userName":{
       type:String
   },
    "facebookId":{
       type:String
    },
   "email":{
       type:String
   },
   "phoneNumber":{
       type:String
   },
   "gender":{
       type:String
   },
   "dateOfBirth":{
       type:String
   },
   "role":{
       type:String
   },
    "address":[{
        "typeOfAddress":String,
        "addressLine1":String,
        "addressLine2":String,
        "city":String,
        "country":String,
        "postalCode":String
    }]
});

const user = module.exports = mongoose.model("User",UserSchema);
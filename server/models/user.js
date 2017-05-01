/**
 * Created by SESA435400 on 5/1/2017.
 */
const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
   "userName":{
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
       type:Date
   },
   "role":{
       type:String
   }
});

const user = module.exports = mongoose.model("User",UserSchema);
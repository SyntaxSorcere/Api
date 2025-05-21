const mongoose = require ('mongoose');
const userSchema = mongoose.Schema({
    user_name : {type:String, required:true},
    user_email: {type:String, required:true, unique: true},
    user_pass: {type:String, required:true},
    user_address: {type:String, required:true},
    user_phone: {type:Number, required:true}
    
}, {versionKey: false});

module.exports = mongoose.model("User", userSchema, "user");
console.log("Model user works");
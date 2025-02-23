const mongoose = require('mongoose');

const userSchema  = new mongoose.Schema({
    id: {type:Number},
    Name: { type: String},
    email:{type:String,required:true,unique:true,trim:true},
    password:{type:String,required:true}
    }, {timestamps: true,});

const user = mongoose.model("user",userSchema);
module.exports = user;// export model
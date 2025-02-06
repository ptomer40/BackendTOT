const mongoose = require('mongoose');

const userSchema  = new mongoose.Schema({
    id: {type:Number,required:true},
    Name: { type: String, required: true },
    email:{type:String,required:true,unique:true,trim:true},
    password:{type:String,required:true}
    }, {timestamps: true,});

const user = mongoose.model("user",userSchema);
module.exports = user;// export model
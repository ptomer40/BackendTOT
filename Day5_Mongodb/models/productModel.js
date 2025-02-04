const mongoose = require('mongoose');

const ProductSchema  = new mongoose.Schema({
    discount: Number,
    company: String,
    title: { type: String, required: true },
    price: { type: Number, min: 1, required: true },
    // availability: { type: String, enum: ["in-stock", "out-of-stock"], default: "in-stock" },
     quantity:{
        type:Number,
        default:1,
        min:0,
     },
     thumbnail:String,
}, {
    timestamps: true,
});

const product = mongoose.model("products", ProductSchema);
module.exports = product;// export model
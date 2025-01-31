const express=require('express');
const dbconn=require('./config/dbConfig')
const mongoose=require('mongoose');
const product=require('./models/productModel')
const app=express();
app.use(express.json());
const PORT=2002;

dbconn().then(()=>{
    if (mongoose.connection.readyState === 1) {
        console.log('MongoDB is connected');
        console.log('Connection details:');
        console.log(`Database URI: ${mongoose.connection.host}:${mongoose.connection.port}`);
        console.log(`Database Name: ${mongoose.connection.name}`);
    } else {
        console.log('MongoDB is not connected');
    }
})

app.post("/api/v1/products",(req,res)=>{
const newProduct=req.body;
 product.create(newProduct);

})


//console.log(db);
app.listen(PORT,()=>{
    console.log("Server running on port:"+PORT);
})
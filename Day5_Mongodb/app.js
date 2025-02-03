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

app.post("/api/v1/products",async(req,res)=>{
    try{
        console.log("Inside api/v1/products");
const newProduct=req.body;
console.log("Data recieved:"+newProduct);
 const doc=await product.create(newProduct);
 console.log("product created");
res.json({
    status:"Data inserted successfully",
    data:doc
})
    }catch(err){
        console.log("Error in /api/v1/products is: "+Object.keys(err));
        console.log("Hii:"+err._message);
        if(err.name=="ValidationError"){
res.status(400).json({
    status:'fail',
    message:'Data validation failed'
})
        }else{
            res.status(500).json({
                status:'fail',
                message:'internal server error'
            })
        }
        
    }
})


//console.log(db);
app.listen(PORT,()=>{
    console.log("Server running on port:"+PORT);
})
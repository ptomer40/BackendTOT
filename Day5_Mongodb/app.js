const express=require('express');
const dbconn=require('./config/dbConfig')
const mongoose=require('mongoose');
const product=require('./models/productModel')
const morgan=require('morgan'); // for logs
const app=express();
const cors=require('cors');
const user=require('./models/userModel');
const bcrypt=require('bcrypt');
const nodemailer=require('nodemailer');
const {main}=require('./utils/emailHelper');
const OTP=require('./models/otpModel');
// Define the CORS options
const corsOptions = {
    origin: 'http://localhost:5173', // Allow this specific origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
  };
  
  // Use CORS with the specified options
  app.use(cors(corsOptions));



//may use for   filter the data
app.use((req,res,next)=>{
console.log("Request recieved:"+req.url);
next()
})
app.use(morgan()); // for logger
app.use(express.json());//middelware
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

app.get('/api/v1/products',async(req,res)=>{
  try{
    console.log("Inside get products");
    const{q="",size=10,page=1, fields="-__v -createdAt -_id"}=req.query; //one time 4 items, fields="-_v -createdAt"==if dont want to consider in result
    console.log("Hiii---"+q);

    //const data1=await product.find();
    const data1=product.find();
    if(q.length>0){
        const reg=new RegExp(q,"i"); //case snesitive search i
        data1.where("title").regex(reg);
    }
    data1.sort("price-title");
    const data1clone=data1.clone();
    data1.skip((page-1)*size);
    data1.limit(size);
    data1.select(fields);
    const products=await data1;
    console.log("products::"+products);
     const totalProducts=await data1clone.countDocuments();
    res.json({
        status:"Data found",
        products:products,
        total: totalProducts
       })
}catch(err){
   console.log("error during fethc:"+err)
   res.status(500).json({
    status:"No data found",
    message:"Internal error message"
   })
  }
})
//user api to store data

app.post("/api/v1/users",async(req,res)=>{
    try{
        console.log("Inside api/v1/users");
const newUser=req.body;
const salt=await bcrypt.genSalt(14);//2^14
const hashedPassword=await bcrypt.hash(newUser.password,salt);
newUser.password=hashedPassword;
console.log("Data recieved:"+newUser);
 const doc=await user.create(newUser);
 console.log("User created");
res.json({
    status:"User inserted successfully",
    data:doc
})
    }catch(err){
        console.log("Error in /api/v1/products is: "+Object.keys(err));
        console.log("Hii:"+err._message);
        if(err.name=="ValidationError"){
res.status(400).json({
    status:'fail',
    message:'Data validation failed'+err.message,
})
        }else{
            res.status(500).json({
                status:'fail',
                message:'internal server error'
            })
        }
        
    }
})
//get user data
app.get('/api/v1/users',async(req,res)=>{
    try{
      console.log("Inside get users");
      const{q="",size=10,page=1, fields="-__v -createdAt -_id"}=req.query; //one time 4 items, fields="-_v -createdAt"==if dont want to consider in result
      console.log("Hiii---"+q);
  
      //const data1=await product.find();
      const data1=user.find();
      if(q.length>0){
          const reg=new RegExp(q,"i"); //case snesitive search i
          data1.where("email").regex(reg);
      }
      data1.sort("id-email");
      const data1clone=data1.clone();
      data1.skip((page-1)*size);
      data1.limit(size);
      data1.select(fields);
      const users=await data1;
      console.log("products::"+users);
       const totalProducts=await data1clone.countDocuments();
      res.json({
          status:"Data found",
          products:users,
          total: totalProducts
         })
  }catch(err){
     console.log("error during fethc:"+err)
     res.status(500).json({
      status:"No data found",
      message:"Internal error message"
     })
    }
  })

// otp Api

app.post("/api/v1/otps",async(req,res)=>{
    try{
       const{email}=req.body;
       //need to add otp should not sent if last 3 manitues check
       if(email && email.length>0){
              const otp=Math.floor(Math.random()*9000+1000);
            const isEmailSent= await main(email,otp);
            if(isEmailSent){
                const hashedOtp= await bcrypt.hash(""+otp,14);
                await OTP.create({email,otp:hashedOtp});
              res.status(201).json({status:'success', message:'Otp sent to email' })
            }else{
                res.status(201).json({status:'fail', message:'unable to sent' })
            }
       }else{
        res.status(400).json({
            status:'fail',
            message:'Email is required'
        })
       }
        
        
    }catch(err){
        console.log("Error in /api/v1/products is: "+Object.keys(err));
        console.log("Hii:"+err._message);
        if(err.name=="ValidationError"){
res.status(400).json({
    status:'fail',
    message:'Data validation failed'+err.message,
})
        }else{
            res.status(500).json({
                status:'fail',
                message:'internal server error'
            })
    }}
})
//console.log(db);
app.listen(PORT,()=>{
    console.log("Server running on port:"+PORT);
})
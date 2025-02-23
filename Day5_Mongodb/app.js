require('dotenv').config;
const express = require('express');
const dbconn = require('./config/dbConfig')
const mongoose = require('mongoose');
const product = require('./models/productModel')
const morgan = require('morgan'); // for logs
const app = express();
const cors = require('cors');
const user = require('./models/userModel');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const { main } = require('./utils/emailHelper');
const OTP = require('./models/otpModel');
const jwt = require("jsonwebtoken");
const cookieParser = require('cookie-parser');
// Define the CORS options
const corsOptions = {
    origin: process.env.FRONTEND_URL, // Allow this specific origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
    // Allowed headers
};

// Use CORS with the specified options
app.use(cors(corsOptions));



//may use for   filter the data
app.use((req, res, next) => {
    console.log("Request recieved:" + req.url);
    next()
})
app.use(morgan()); // for logger morgan('dev')
app.use(express.json());//middelware
const PORT = 2003;

dbconn().then(() => {
    if (mongoose.connection.readyState === 1) {
        console.log('MongoDB is connected');
        console.log('Connection details:');
        console.log(`Database URI: ${mongoose.connection.host}:${mongoose.connection.port}`);
        console.log(`Database Name: ${mongoose.connection.name}`);
    } else {
        console.log('MongoDB is not connected');
    }
})

// app.post("/api/v1/products",async(req,res)=>{
//     try{
//         console.log("Inside api/v1/products");
// const newProduct=req.body;

// console.log("Data recieved:"+newProduct);
//  const doc=await product.create(newProduct);
//  console.log("product created");
// res.json({
//     status:"Data inserted successfully",
//     data:doc
// })
//     }catch(err){
//         console.log("Error in /api/v1/products is: "+Object.keys(err));
//         console.log("Hii:"+err._message);
//         if(err.name=="ValidationError"){
// res.status(400).json({
//     status:'fail',
//     message:'Data validation failed'
// })
//         }else{
//             res.status(500).json({
//                 status:'fail',
//                 message:'internal server error'
//             })
//         }

//     }
// })

app.get('/api/v1/products', async (req, res) => {
    try {
        console.log("Inside get products");
        const { q = "", size = 10, page = 1, fields = "-__v -createdAt -_id" } = req.query; //one time 4 items, fields="-_v -createdAt"==if dont want to consider in result
        console.log("Hiii---" + q);

        //const data1=await product.find();
        const data1 = product.find();
        if (q.length > 0) {
            const reg = new RegExp(q, "i"); //case snesitive search i
            data1.where("title").regex(reg);
        }
        data1.sort("price-title");
        const data1clone = data1.clone();
        data1.skip((page - 1) * size);
        data1.limit(size);
        data1.select(fields);
        const products = await data1;
        console.log("products::" + products);
        const totalProducts = await data1clone.countDocuments();
        res.json({
            status: "Data found",
            products: products,
            total: totalProducts
        })
    } catch (err) {
        console.log("error during fethc:" + err)
        res.status(500).json({
            status: "No data found",
            message: "Internal error message"
        })
    }
})
//user api to store data

// app.post("/api/v1/users",async(req,res)=>{
//     try{
//         const{otp,email,password}=req.body;
//         const otpDoc=OTP.findOne({
//             createdAt:{
//                 $gte:Date.now-3*60*1000,
//             },
//             email:email,
//         });
// //         console.log("Inside api/v1/users");
// // const newUser=req.body;
// // const salt=await bcrypt.genSalt(14);//2^14
// // const hashedPassword=await bcrypt.hash(newUser.password,salt);
// // newUser.password=hashedPassword;
// // console.log("Data recieved:"+newUser);
// //  const doc=await user.create(newUser);
// //  console.log("User created");
// // res.json({
// //     status:"User inserted successfully",
// //     data:doc
// // })
//     }catch(err){
//         console.log("Error in /api/v1/products is: "+Object.keys(err));
//         console.log("Hii:"+err._message);
//         if(err.name=="ValidationError"){
// res.status(400).json({
//     status:'fail',
//     message:'Data validation failed'+err.message,
// })
//         }else{
//             res.status(500).json({
//                 status:'fail',
//                 message:'internal server error'
//             })
//         }

//     }
// })

//new API

app.post("/api/v1/users", async (req, res) => {
    try {
        const { otp, email, password, id, Name } = req.body;
        if (!otp || !email || !password) {
            res.status(400).json({
                status: 'fail',
                message: "otp or email or password is required"
            })
        }

        // otp that is sent within last X=10 minutes
        // const otpDoc = await OTP.findOne({
        //     createdAt: {
        //         $gte: Date.now() - 10 * 60 * 1000,
        //     },
        //     email: email,
        // });
        const otpDoc = await OTP.findOne()
            .where("createdAt")
            .gte(Date.now() - 10 * 60 * 1000)
            .where("email")
            .equals(email);

        if (otpDoc === null) {
            res.status(400);
            res.json({
                statusbar: "fail",
                message: "Either otp has expired or was not sent!",
            });
            return;
        }

        const hashedOtp = otpDoc.otp;

        const isOtpValid = await bcrypt.compare(otp.toString(), hashedOtp);

        if (isOtpValid) {
            const salt = await bcrypt.genSalt(14); // 2^14
            const hashedPassword = await bcrypt.hash(password, salt);
            const newUser = await user.create({
                email,
                password: hashedPassword,
                id,
                Name
            });

            res.status(201);
            res.json({
                status: "success",
                message: "User created",
            });
        } else {
            res.status(401);
            res.json({
                status: "fail",
                message: "Incorrect OTP!",
            });
        }
    } catch (err) {
        console.log(err.name);
        console.log(err.code);
        console.log(err.message);
        if (err.code == 11000 || err.name == "ValidationError") {
            res.status(400).json({
                status: "fail",
                message: "Data validation failed: " + err.message,
            });
        } else {
            res.status(500).json({
                status: "fail",
                message: "Internal Server Error",
            });
        }
    }
});
//get user data
app.get('/api/v1/users', async (req, res) => {
    try {
        console.log("Inside get users");
        const { q = "", size = 10, page = 1, fields = "-__v -createdAt -_id" } = req.query; //one time 4 items, fields="-_v -createdAt"==if dont want to consider in result
        console.log("Hiii---" + q);

        //const data1=await product.find();
        const data1 = user.find();
        if (q.length > 0) {
            const reg = new RegExp(q, "i"); //case snesitive search i
            data1.where("email").regex(reg);
        }
        data1.sort("id-email");
        const data1clone = data1.clone();
        data1.skip((page - 1) * size);
        data1.limit(size);
        data1.select(fields);
        const users = await data1;
        console.log("products::" + users);
        const totalProducts = await data1clone.countDocuments();
        res.json({
            status: "Data found",
            products: users,
            total: totalProducts
        })
    } catch (err) {
        console.log("error during fethc:" + err)
        res.status(500).json({
            status: "No data found",
            message: "Internal error message"
        })
    }
})

// otp Api

app.post("/api/v1/otps", async (req, res) => {
    try {
        const { email } = req.body;
        //need to add otp should not sent if last 3 manitues check
        if (email && email.length > 0) {
            const otp = Math.floor(Math.random() * 9000 + 1000);
            const isEmailSent = await main(email, otp);
            if (isEmailSent) {
                const hashedOtp = await bcrypt.hash("" + otp, 14);
                await OTP.create({ email, otp: hashedOtp });
                res.status(201).json({ status: 'success', message: 'Otp sent to email' })
            } else {
                res.status(201).json({ status: 'fail', message: 'unable to sent' })
            }
        } else {
            res.status(400).json({
                status: 'fail',
                message: 'Email is required'
            })
        }


    } catch (err) {
        console.log("Error in /api/v1/products is: " + Object.keys(err));
        console.log("Hii:" + err._message);
        if (err.name == "ValidationError") {
            res.status(400).json({
                status: 'fail',
                message: 'Data validation failed' + err.message,
            })
        } else {
            res.status(500).json({
                status: 'fail',
                message: 'internal server error'
            })
        }
    }
})

//Login
app.post("/api/v1/login", async (req, res) => {
    const { email, password: plainPassword } = req.body; // renaming
    const currentUser = await user.findOne({ email: email });
    if (currentUser) {
        const { _id, name, password: hashedPassword } = currentUser;
        const isPasswordCorrect = await bcrypt.compare(plainPassword, hashedPassword);
        if (isPasswordCorrect) {
            const token = jwt.sign({ email, name, _id }, "secret_key_generated_abcd_123", { expiresIn: '1h' }); // expires after 1 hr
            console.log(token);
            res.cookie("authorization", token, { httpOnly: true, sameSite: "none", secure: 'true' });
            res.status(200);
            res.json({
                status: "success",
            })
        } else {
            res.status(401);
            res.json({
                status: "fail",
                message: "Email Password is invalid"
            });
        }


    } else {
        res.status(400);
        res.json({
            status: 'fail',
            message: "user is not registered"
        })
    }
})
app.use(cookieParser()); // for specific middleware for products

app.use((req, res, next) => {
    const { authorization } = req.cookies;// retrive token from req coz it is already generated
    jwt.verify(authorization, "secret_key_generated_abcd_123", (error, decoded) => {
        if (error) {
            res.status(401);
            res.json({
                status: "fail",
                message: "Unauthorized",
            })
            return;
        }
        req.userInfo = decoded;
        next();
    })
})
//CheckLogged in

app.get("/api/v1/isLoggedIn", (req, res) => {
    res.status(200);
    res.json({
        status: "success",
        data: req.userInfo
    });
})

app.post("/api/v1/products", async (req, res) => {
    try {
        console.log("Inside api/v1/products");
        const newProduct = req.body;

        console.log("Data recieved:" + newProduct);
        const doc = await product.create(newProduct);
        console.log("product created");
        res.json({
            status: "Data inserted successfully",
            data: doc
        })
    } catch (err) {
        console.log("Error in /api/v1/products is: " + Object.keys(err));
        console.log("Hii:" + err._message);
        if (err.name == "ValidationError") {
            res.status(400).json({
                status: 'fail',
                message: 'Data validation failed'
            })
        } else {
            res.status(500).json({
                status: 'fail',
                message: 'internal server error'
            })
        }

    }
})

//console.log(db);
app.listen(PORT, () => {
    console.log("Server running on port:" + PORT);
})
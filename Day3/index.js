const data=require('./readFile')
const express=require('express');

// const promiseData=data("./data.json");
// promiseData.then((res)=>{console.log(res)})

    const app=express();
    app.get("/",async(req,res)=>{
        const promiseData=await data("./data.json");
        res.send(promiseData);
    })
    
    app.listen(2000,()=>{
        console.log("Server is running on"+2000);
    })


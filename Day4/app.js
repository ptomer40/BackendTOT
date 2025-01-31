const express = require('express');
const { myReadFile, writeMyFile,createNewId } = require('./utils');

const fs = require('fs').promises;
const app = express();
app.use(express.json()); //middleware to need to see bodyparser

app.get("/", (req, res) => {
    res.send("Default channel of web page");
});


// app.post("/products",async(req,res)=>{
//     console.log(req.body);

//     const newProduct=req.body;
//     const data=[newProduct];
// await fs.writeFile("./db.json",JSON.stringify(data));
// res.json({
//     status:"Success",
// })
// })


app.get("/getProducts",async(req,res)=>{
    try{
        const arr = await myReadFile();
        //res.send(arr);
        res.send(JSON.stringify(arr));
        // res.json({
        //     status:"success",
        //     data:arr,
        // })
    }catch(err){
        console.log("Error during read getproducts"+err);
        res.json({status:"fail"})
    }
})


app.post("/products", async (req, res) => {
    try {
        const newProduct=req.body;
        const arr = await myReadFile();
        console.log(arr);
        const tid=createNewId(arr);
        console.log("tid="+tid);
        newProduct.id=tid; //add tid into newProduct retrieve from frontend
        arr.push(req.body); // req.body read client data
        console.log(req.body);
        //arr.push(newProduct);
        await writeMyFile(arr); // write data
        res.json({ status: "success" });
    } catch (err) {
        console.log("Error in products:" + err.message);
        res.json({ status: "fail" });
    }
})

app.patch("/products/:productId",async(req,res)=>{
 try{
    const productId= req.params.productId;
    const newProductInfo=req.body;
    console.log(productId);
    const arr=await myReadFile();
       const foundIndex=arr.findIndex((obj)=>{
        if(obj.id==productId){
            return true;
        }
        else return false;
       });
if(foundIndex!=-1){
const oldproduct=arr[foundIndex];
const newProduct={...oldproduct,...newProductInfo};
arr[foundIndex]=newProduct;
writeMyFile(arr);
  res.json({
    status:"Hi, successs"
  })
}else{
    res.json({
        status:'fail',
        message:'Invalid index',
    })
}

    }catch(err){
        console.log("Error in patch"+err.message);
    }
})

app.delete("/products/:productId",async(req,res)=>{
    try{
        const productId= req.params.productId;
        const arr=await myReadFile();
        console.log(arr);
        const foundIndex=arr.findIndex((obj)=>{
            return obj.id==productId;
        })
if(foundIndex!=-1){
arr.splice(foundIndex,1);// remove one element
await writeMyFile(arr);
res.json({
    status:"Deleted Successfully!!!"
})
}else{
    res.json({
        status:'Invalid Id , could not delete'
      })
}
    

    }catch(err){
console.log("Error in delete api"+err.message);
  res.json({
    status:'fail delete'
  })
    }
    

})


app.listen(1400, () => {
    console.log("Application started at: " + 1400);
});
const fs=require('fs').promises;
   myReadFunction=async()=>{
    try{
    //const promise= await fs.readFile("data.txt");
    const promise= (await fs.readFile("data.txt")).toString();
console.log(promise);
    }
    catch(err){
        console.log("Error is:"+err);
    }
    // promise.then((data)=>{
    //     console.log(data.toString());
    // }).catch((err)=>{
    //     console.log("Hii"+err);
    // })
}       
myReadFunction();
console.log("Middle");
myReadFunction();

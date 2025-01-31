const fs=require('fs').promises;
const path="./db.json";
async function myReadFile(){
    try{
        data=await fs.readFile(path,"utf-8");
        const arr=JSON.parse(data);//text to JSON
        return arr;
    }catch(err){
     console.log("myReadfile Error is:"+err.message);
     return [];
    }
}

const writeMyFile=async(fdata)=>{
    try{        
        const text=JSON.stringify(fdata);//convert js object to text
            await fs.writeFile(path,text);
            return true;
    }catch(err){
        console.log("Error in writeFile"+err.message);
        return false;
    }
}

function createNewId(arr){
 const arrlength=arr.length;
    if(arrlength>0){
           const lastitem=arr[arrlength-1];
           const lastitemid=lastitem.id;
           return lastitemid+1;
 }
 return 1;
}

module.exports={myReadFile,writeMyFile,createNewId}
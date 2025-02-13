const fs=require('fs').promises;
 async function myfileRead(fpath){
      const promise= await fs.readFile(fpath,{encoding:'utf-8'})
      return promise;

}
module.exports=myfileRead;
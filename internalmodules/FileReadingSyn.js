const fs=require('fs');
const data=fs.readFileSync("data1.txt",{encoding:"utf-8"});
//console.log(data.toString());
console.log(data);
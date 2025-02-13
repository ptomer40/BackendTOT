const fs=require('fs');
const data=fs.readFileSync("pdfdata.pdf",{encoding:"utf-8"});
//console.log(data.toString());
console.log(data);
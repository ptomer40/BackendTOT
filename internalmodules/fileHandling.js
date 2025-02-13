const fs=require('node:fs');
let msg="Hello Node js";
fs.writeFileSync("./pdfdata.xlsx",msg);
console.log("Pdf Generated");
//msg+="Programmin language";
//fs.writeFileSync("./data1.txt",msg);


const fs=require('node:fs');
let msg="Hello Node js";
fs.writeFileSync("./data.txt",msg);
msg+="Programmin language";
fs.writeFileSync("./data1.txt",msg);


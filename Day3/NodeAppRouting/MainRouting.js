const http=require('http');
const fs=require('fs').promises;
const fs1=require('fs');
const server=http.createServer((req,res)=>{
    if(req.url=="/"){
        
     res.end(fs1.readFileSync("./Home.html"));
    }

    else if(req.url=="/aboutus"){
       const rd=fs.readFile("./About.html");
       rd.then((data)=>{
        res.end(data);
       })
        //res.end();
// res.end(fs.readFileSync("./About.html"));
    }
    
else{
    res.end(fs1.readFileSync("./Error.html"));
}
})
server.listen(2002,()=>{
console.log("Server running on "+2002);
});
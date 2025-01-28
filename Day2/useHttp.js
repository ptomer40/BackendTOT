const http=require('http');
const PORT=3003;
const server=http.createServer((req,res)=>{
    console.log("How r u");
    //console.log("hey key is:"+Object.keys(req));// find url


    console.log(req.url);
    //res.write("Using Write");
    
    res.setHeader('Content-Type','text/html')
  
    
    const response=fetch("https://jsonplaceholder.typicode.com/comments?postId=1");
    console.log(response);
    response.then((data)=>{
        console.log(data);
        data.json().then((res1)=>{
            console.log(res1);
            //res.end(JSON.stringify(res1));
            res.end(`
                <html>
                <head>JSON DATA
                <style>
                h1{
                background-color:cyan;
                color:red;
                }
                </style>
                </head>
                <body>
                <h1>${res1[0].id}</h1>
                <h1>${res1[0].name}</h1>
                <h1>${res1[0].body}</h1>
                </body>
                </html>
                `);
        })
    })
   
    
    //res.end("<h1 style='color:red;background-color:cyan'>Hellloo</h1>");

     

})
server.listen(PORT,()=>{
    console.log("Server is running on"+PORT);
})
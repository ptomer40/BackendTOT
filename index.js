function sum(){
    console.log("Hello");  //ctrl+` to open editor
    return 20+30;
    }
function fun(){
console.log("Hello");  //ctrl+` to open editor
return "Hello World";
}

const obj={
    add:sum,
    msg:fun
}
//module.exports=fun;
module.exports=obj;
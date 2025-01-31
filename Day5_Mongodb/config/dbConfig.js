const mongoose=require('mongoose');
async function dbconn(){
    try{
     
      await mongoose.connect("mongodb+srv://tomer1580:root@cluster0.uipba.mongodb.net/abes_tot_cafe_management?retryWrites=true&w=majority&appName=Cluster0");
        console.log("----------db connected!--------");
    }catch(err){
        console.log("Error in db conn:"+err.message);
    }
}
module.exports= dbconn; // no need to export coz once mongoose connected it is avialbel in application 
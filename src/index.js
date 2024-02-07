const express=require("express");
const app=express();
const bodyParser=require("body-parser");
const {PORT}=require("./config/serverConfig")
const db=require("./models/index");
const appRouter=require("./Routes/index")

const setupAndStartServer=()=>{
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended:true}));
   

    app.use("/bookingService/api",appRouter)
    

    app.listen(PORT,(req,res)=>{
         
      
        console.log(`listening on the PORT ${PORT}`)
      
        
    })


    

}
setupAndStartServer();
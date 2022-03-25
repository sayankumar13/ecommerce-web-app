const app = require("./app")
const cloudinary = require("cloudinary");
 const connectDatabase = require("./config/database")

// Hndeling uncaught exception

process.on("uncaughtException", (err) =>{
    console.log(`Error: ${err.message}`);
    console.log(`Shutting Down the server due to uncaught exception`);
    process.exit(1) 
})

//  config
if(process.env.NODE_ENV !== "PRODUCTION"){
require("dotenv").config({path:"backend/config/.env"})
}
// connect Database
connectDatabase();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

 const server = app.listen(process.env.PORT,() =>(
     console.log(`server is working on http://localhost:${process.env.PORT}`)
 ))
 
// unhandle promise rejection error
process.on("unhandledRejection", (err) =>{
    console.log(`Error: ${err.message}`);
    console.log(`Shutting Down the server due to unhandle promise rejection`);
    server.close(() =>{
        process.exit(1);
    });
});
 
const express = require("express")
const app = express();
const cookieParser = require("cookie-parser");
const errorMiddleware = require("./middleware/error")
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const path = require("path");

//  config
if(process.env.NODE_ENV !== "PRODUCTION"){
    require("dotenv").config({path:"backend/config/.env"})
}

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended:true,limit:"50mb"}));
app.use(fileUpload());
// Route Imports
const product = require("./routes/productRoute");
const Offers = require("./routes/offerRoute");
const user = require("./routes/userRoute");
const order = require("./routes/orderRoute");
const payment = require("./routes/paymentRoute");

app.use("/api/v1",product);

app.use("/api/v1",Offers);

app.use("/api/v1",user);

app.use("/api/v1",order);

app.use("/api/v1",payment);

app.use(express.static(path.join(__dirname,"../frontend/build")));

app.get("*",(req,res) =>{
    res.sendFile(path.resolve(__dirname,"../frontend/build/index.html"));
})

// Middleware for errors
app.use(errorMiddleware)


module.exports = app 
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/Restro",{
    useNewUrlParser:true
}).then(()=>{
    console.log("db connected successfully");
}).catch((e)=>{
    console.log(e);
})
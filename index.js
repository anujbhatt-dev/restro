const express= require("express")
const app = express()
const UserRouter = require("./routes/userRoute")
// const ejs = require("ejs")
const PORT = process.env.PORT || 3001 ;
const passport = require('passport')
const expressSession = require("express-session")
const {initializingPassport} = require("./passportConfig")
// require("./dbconnect")
// app.set("view engine","ejs")
app.use(express.json())
app.use(express.urlencoded({extended:true}))
require("./dbConnect")

initializingPassport(passport);
app.use(expressSession({secret:"secret",resave:false,saveUninitialized:false}))
app.use(passport.initialize())
app.use(passport.session())

app.use("/api/users",UserRouter);




app.listen(PORT,()=>{
    console.log(`listening to port ${PORT}`);
})
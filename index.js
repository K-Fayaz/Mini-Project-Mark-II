require("dotenv").config();
require("./Model/");

const path          = require("path");
const express       = require("express");
const ejsMate       = require("ejs-mate");
const cookieParser  = require("cookie-parser");
const getUser       = require("./helper/get_user");
const app = express();


// enable cookies
app.use(cookieParser());

// static files in public directory
app.set('views',path.join(__dirname,"view"))
app.use(express.static(path.join(__dirname,'public')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// set view engine
app.engine("ejs",ejsMate);
app.set('view engine','ejs');



// locals that can be accessed by any file in View directory
app.use(async(req,res,next)=>{
  res.locals.currUser = req.cookies.auth;
  if(res.locals.currUser)
  {
    res.locals.loggedIn_user = await getUser(res.locals.currUser);
    console.log(res.locals.loggedIn_user);
  }
  console.log(res.locals.currUser);
  next();
});

// get the Routes here
const userRoutes = require("./Routes/userRoutes");
const rideRoutes = require("./Routes/rideRoutes");

app.use("/",userRoutes);
app.use("/",rideRoutes);


let PORT = process.env.PORT || 3000;

app.listen(PORT,()=>{
  console.log(`listening to the PORT ${PORT}`);
});
const bcrypt = require("bcryptjs");
const jwt    = require("jsonwebtoken");
const User   = require("../Model/userModel");

const isLoggedIn = async (req,res,next)=>{
  try{
    let { auth } = req.cookies;
    // if there is no auth cookie than the user is not logged in or doesnt have an Account
    // so ask him to login
    if(!auth)
    {
      return res.redirect("/login");
    }

    // if there is an auth cookie than
    // 1. Check if the cookie is valid and is not tamprered with

    let decode = await jwt.verify(auth,process.env.MINT_SECRET);
    // Now check if there is a User with the id = decode.id
    let user = await User.findById(decode.id);

    if(!user){
      // if there is no user found then ask him to Login
      return res.redirect("/login");
    }
    next();

  }
  catch(err)
  {
    console.log("something went wrong !");
    console.log(err);
    res.redirect("/login");
  }
}

module.exports = {
  isLoggedIn,
}

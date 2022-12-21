const isValidated = (req,res,next)=>{
  try{
    const { user } = req.cookies;
    if(user)
      res.redirect("/register/user/details");
    else{
      next();
    }
  }
  catch(err)
  {
    console.log(err);
  }
}

module.exports = {
  isValidated,
}

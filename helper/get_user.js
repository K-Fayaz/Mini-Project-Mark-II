const jwt  = require("jsonwebtoken");
const User = require("../Model/userModel");

const getUser = async(auth)=>{

    let token = await jwt.verify(auth,process.env.MINT_SECRET);
    let user  = await User.findById(token.id);

    return user;

}


module.exports = getUser;

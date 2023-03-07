const mongoose = require("mongoose");


// connect to mongoose database
const DB_URL    = process.env.DEV_DB_URL;
const ATLAS_URL = process.env.ATLAS_DB_URL; 

const atlasUrl = "mongodb+srv://fayazkudremane3000:yepAXXvmr0KDbRAL@cluster0.rmjzaoy.mongodb.net/?retryWrites=true&w=majority";


mongoose.connect(atlasUrl)
  .then((data)=>{
    console.log('connected to MongoDB database');
  })
  .catch((err)=>{
    console.log("There is an Error");
    console.log(err);
  });

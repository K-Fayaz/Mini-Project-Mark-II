const mongoose = require("mongoose");
const { Schema , model } = mongoose;


const requestSchema = new Schema({
  ride:{
    type:mongoose.ObjectId,
    ref:"Ride"
  },
  from:{
    type:mongoose.ObjectId,
    ref:"User",
  },
  seats:{
    type: Number,
  },
  price:{
    type:Number,
  }
});


const Request = model("Request",requestSchema);
module.exports = Request;

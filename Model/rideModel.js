const mongoose = require("mongoose");
const { Schema , model} = mongoose;



const rideSchema = new Schema({
  from: {
    type:String,
    required: true
  },
  to:{
    type: String,
    required: true
  },
  price:{
    type: Number,
    required: true,
  },
  seats:{
    type: Number,
    required: true,
  },
  date:{
    type:String,
    required:true,
  },
  time:{
    type: String,
    required: true
  },
  driver:{
    type: mongoose.ObjectId,
    ref:"User",
  },
  status:{
    type:String,
    default:"Offered",
    enum:["Offered","scheduled"],
  }
});

const rideModel = model("Ride",rideSchema);
module.exports = rideModel;

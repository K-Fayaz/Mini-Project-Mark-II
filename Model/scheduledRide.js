const mongoose = require("mongoose");
const { Schema , model } = mongoose;


const scheduledRideSchema = new Schema({
  driver:{
    type: mongoose.ObjectId,
    ref:"User",
    required: true
  },
  passenger:{
    type:mongoose.ObjectId,
    ref:"User",
    required: true,
  },
  ride:{
    type:mongoose.ObjectId,
    ref:"Request",
    required: true,
  },
  price:{
    type:Number,
    required: true,
  },
  seats:{
    type: Number,
    required: true,
  },
  status:{
    type:String,
    default:"Scheduled",
    enum:["Scheduled","Started","ended"]
  }
});



const ScheduledRide = model("ScheduledRide",scheduledRideSchema);
module.exports = ScheduledRide;

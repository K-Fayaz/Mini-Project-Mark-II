const mongoose = require("mongoose");
const { Schema , model } = mongoose;

const userSchema = new Schema({
  username:{
    type:String,
    required: true,
    minLength: 3
  },
  email:{
    type:String,
    required: true
  },
  phone:{
    type:Number,
    // required: true
  },
  password:{
    type:String,
    required: true,
    minLength: 8
  },
  offers:{
    type: [mongoose.ObjectId],
    ref:"Ride"
  },
  requests:{
    type:[mongoose.ObjectId],
    ref:"Request",
  },
  scheduledRides:{
    type:[mongoose.ObjectId],
    ref:"ScheduledRide",
  },
  address:{
    type:String,
    required: true,
  },
  key:{
    type:String,
    required: true,
  }
});

const User = mongoose.model('User',userSchema);

module.exports = User;

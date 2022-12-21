const otpGenerator       = require('otp-generator');
const { ethTransfer }        = require("../helper/ether");
const Ride               = require("../Model/rideModel");
const User               = require("../Model/userModel");
const getUser            = require("../helper/get_user");
const Request            = require("../Model/requestModel");
const { sendEmail }      = require("../helper/helperFunctions");
const ScheduledRide      = require('../Model/scheduledRide');
const { getEthPriceNow } = require("get-eth-price");

const offer_ride_get = (req,res)=>{
  res.render("offer_ride");
}

const offer_ride_post = async(req,res)=>{
  try{

    let { from , to , time , date , seats , price } = req.body;

    // get the user
    let user = await getUser(res.locals.currUser);
    // console.log(user);

    let newRide = new Ride;

    newRide.to     = to;
    newRide.time   = time;
    newRide.date   = date;
    newRide.from   = from;
    newRide.price  = price;
    newRide.seats  = seats;
    newRide.driver = user._id;

    await newRide.save();

    user.offers.push(newRide._id);
    await user.save();

    console.log(newRide);
    console.log(user);
    res.status(201).json(newRide);
  }
  catch(err)
  {
    console.log(err);
    res.status(400).send(err);
  }
}


const request_ride_get = async(req,res)=>{
  res.render("requestRide");
}


const request_ride_post = async(req,res)=>{
  try{

    let { from , to } = req.body;
    console.log(req.body);

    // find offers with this route
    const toRides   = await Ride.find({ to: to , from : from}).populate("driver");

    console.log(toRides);

    res.status(200).send(toRides);

  }
  catch(err)
  {
    console.log(err);
    res.status(400).send("something went wrong!");
  }
}


const get_ride = async(req,res)=>{
  try{
    let { from , to } = req.query;
    let { id } = req.params;

    let ride = await Ride.findById(id);
    console.log(ride);

    res.status(200).render("ride",{ to , from });

  }
  catch(err)
  {
    console.log(err);
    res.status(404).send("<h1>404 NOT FOUND</h1>");
  }
}


const send_request_mail = async(req,res)=>{
  try{
    let id = req.params.id;
    console.log(req.body);
    let requestedRide = await Ride.findById(id);
    let fromUser = await getUser(res.locals.currUser);
    let toUser = await User.findById(requestedRide.driver);

    console.log(toUser);
    console.log(fromUser);
    console.log(requestedRide);
    // console.log(req.body.to);

    const newRequest = new Request;
    newRequest.from = fromUser._id;
    newRequest.ride = requestedRide._id;
    newRequest.seats = req.body.seats;
    newRequest.price = req.body.price;

    await newRequest.save();
    console.log(newRequest);

    toUser.requests.push(newRequest);
    toUser.save();

    let htmlContent= `
      <h3>Hi ${toUser.username}, you have a request from ${fromUser.username}</h3><br>
    `;

    let response = await sendEmail(toUser.email,htmlContent);
    console.log(response);

    res.redirect("/account");

  }
  catch(er)
  {
    console.log(er);
    res.status(400).send(er);
  }
}


const get_request_ride_info = async(req,res)=>{
  try{

    let requesingUser = await getUser(res.locals.currUser);
    console.log(requesingUser)
    console.log(req.params)

    let ride = await Ride.findById(req.params.id);
    console.log(ride);

    res.render("request_ride_single",{ req: requesingUser , ride });
  }
  catch(err)
  {
    res.status(400).send(err);
  }
}


const send_OTP_confirm = async(req,res)=>{
  try{
    const { email , id } = req.body;
    console.log(req.body);
    let user = await User.findOne({ email });
    console.log(user);

    const scheduled = await ScheduledRide.findById(id);
    console.log(scheduled);

    let otp  = otpGenerator.generate(4,{ lowerCaseAlphabets: false , upperCaseAlphabets: false , specialChars: false });
    let htmlContent = `
      Hello ${user.username} , here is your confirmation OTP <b>${otp}<b>
    `;

    res.cookie("sch_rd_23",otp,{
      httpOnly: true,
      maxAge:1000 * 60 * 60 * 24,
    });

    res.cookie("sch_rd_id",id,{
      httpOnly: true,
      maxAge:1000 * 60 * 60 * 24,
    });

    let response = await sendEmail(user.email , htmlContent);
    res.status(200).send("OK");

  }
  catch(err)
  {
    console.log(err);
    res.status(400).send(err);
  }
}


const validate_otp = async(req,res)=>{
  try{
    const { otp } = req.body;
    const { sch_rd_id ,  sch_rd_23 } = req.cookies;

    const ride = await ScheduledRide.findById(sch_rd_id);

    if(otp == sch_rd_23)
    {
      console.log("OTP is valid");

      ride.status = "Started";
      await ride.save();

      res.cookie("sch_rd_id","",{
        maxAge:1,
      });

      res.cookie("sch_rd_23","",{
        maxAge:1,
      });

      res.redirect("/account/rides/scheduled");
    }else{
      res.redirect("/validate/OTP/start/ride/")
    }

  }
  catch(err)
  {
    console.log(err);
    res.redirect("/validate/OTP/start/ride/");
    // res.status(400).send(err);
  }
}

const end_otp_request = async(req,res)=>{
  try{
    const {  email , id } = req.body;
    const user = await User.findOne({ email });

    let ride = await ScheduledRide.findById(id);

    let otp = otpGenerator.generate(4,{ lowerCaseAlphabets: false , upperCaseAlphabets: false , specialChars: false });

    let htmlContent = `
      HI ${user.username} here is your OTP to end ride , <b>${otp}</b>
    `;

    res.cookie("end_rd",id,{
      maxAge:1000 * 60 * 60 * 24,
      httpOnly: true,
    });

    res.cookie("end_rd_sec",otp,{
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
    });

    let response = await sendEmail(user.email , htmlContent);
    console.log(response);

    res.status(200).send("OK");

  }
  catch(err)
  {
    console.log("something went wrong !",err);
    res.status(400).send(err);
  }
}


const end_ride_validate_otp = async(req,res)=>{
  try{
    const { end_rd , end_rd_sec } = req.cookies;
    const { otp } = req.body;

    const driverId    = req.body.driver;
    const passengerId = req.body.passenger; 

    const driver = await User.findById(driverId);
    const passenger = await User.findById(passengerId);
    
    const ride = await ScheduledRide.findById(end_rd);


    // transfering ethers here 

    if(otp == end_rd_sec)
    {
      console.log("OTP is valid");
      ride.status =  "ended";
      await ride.save();

      res.cookie("end_rd","",{
        maxAge:1
      })

      res.cookie("end_rd_sec","",{
        maxAge: 1,
      })

      getEthPriceNow()
      .then(async(data)=>{
        let key = Object.keys(data)[0];
        console.log(key)
        let ethPrice = data[key].ETH.USD * 82.85;
        console.log(ethPrice);

        let transferMoney = ride.price / ethPrice;
        console.log(transferMoney + " ETH");

        await ethTransfer(passenger.address,passenger.key,driver.address,transferMoney);

      })
      .catch((err)=>{
        console.log(err);
      })

      

      res.status(200).send("OK");

    }else{
      res.status(400).send("OTP is invalid!");
    }

  }
  catch(err)
  {
    console.log(err);
    res.status(400).send(err);
  }
}

module.exports = {
  get_ride,
  validate_otp,
  offer_ride_get,
  offer_ride_post,
  end_otp_request,
  request_ride_get,
  send_OTP_confirm,
  send_request_mail,
  request_ride_post,
  get_request_ride_info,
  end_ride_validate_otp,
}

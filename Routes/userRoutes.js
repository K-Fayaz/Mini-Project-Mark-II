const { Router } = require("express");
const otp        = require("otp-generator");

let sid = process.env.TWILIO_SID;
let twilioToken = process.env.TWILIO_AUTH_TOKEN;
let client = require("twilio")(sid,twilioToken);

const helper     = require("../helper/authControl");
const controller = require("../Controller/userController");
const { isValidated } = require("../Middlewares/isValidated");

const router = Router();

router.get("/",(req,res)=>{
  res.render("home");
});

router.get("/get/user/balance",controller.get_balance);

router.route("/register/")
  .get(isValidated,controller.get_signup)
  .post(controller.post_signup);

router.get("/register/user/details",controller.register_user_details);
router.post("/validate-email",controller.post_email_validate);


router.route("/login")
  .get(controller.get_login)
  .post(controller.post_login);

router.post("/user/add/phone",controller.add_phone);

router.post("/edit/",controller.user_edit);

router.post("/logout",controller.logout);

router.get("/account",helper.isLoggedIn,controller.get_account)


router.get("/account/requests",helper.isLoggedIn,controller.get_requests);

router.route("/account/rides/offered/")
    .get(helper.isLoggedIn,controller.get_offered_rides)
    .delete(helper.isLoggedIn,controller.delete_offered_ride);

router.get("/account/rides/scheduled",helper.isLoggedIn,controller.get_scheduled_rides);

router.delete("/account/request/delete",helper.isLoggedIn,controller.delete_request);

router.post("/ride/accept/ride/:rideId/request/:reqId/:email",helper.isLoggedIn,controller.accept_request);

// password change request 
router.post("/account/password/change/request",helper.isLoggedIn,controller.passoword_change_post);

router.route("/user/password/request/verified/")
    .get(helper.isLoggedIn,controller.password_change_verified_get);

router.post("/password/change/verified/",controller.password_change_verified_post);

router.post('/register/otp-validate',async(req,res)=>{
  let { phone } = req.body;


  let Otp = otp.generate(6,{ lowerCaseAlphabets: false , upperCaseAlphabets: false , specialChars: false });

  console.log(Otp);
  try{
    client.messages.create({
      body:`Hi this is Fayaz Here is Your OTP ${Otp}`,
      from:process.env.TWILIO_PHONE,
      to: "+91" + phone
    })
    .then((data)=>{
      console.log("200 OK");
      console.log(data.id);
      res.status(200).json({
        yourOTP:Otp
      })
    })
    .catch((err)=>{
      console.log(err);
    })
  }
  catch(err){

  }
});

module.exports = router;

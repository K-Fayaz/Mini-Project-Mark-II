const express        = require("express");
const { isLoggedIn } = require("../helper/authControl");
const rideController = require("../Controller/rideController");


const router  = express.Router();


router.route("/offer/ride")
  .get(isLoggedIn,rideController.offer_ride_get)
  .post(isLoggedIn,rideController.offer_ride_post);

router.route("/request/ride")
  .get(isLoggedIn,rideController.request_ride_get)
  .post(isLoggedIn,rideController.request_ride_post);

router.get("/ride/:id",rideController.get_ride);

router.post("/ride/request/:id",rideController.send_request_mail);

router.get("/request/ride/:id",isLoggedIn,rideController.get_request_ride_info);

router.post("/ride/start/request",isLoggedIn,rideController.send_OTP_confirm);

router.get("/validate/OTP/start/ride/",(req,res)=>{
  res.render("validate_OTP");
});

router.post("/otp/validate/ride/start/",isLoggedIn,rideController.validate_otp);

router.post("/end/ride/verify/otp",isLoggedIn,rideController.end_ride_validate_otp);

router.post("/send/otp/end/ride",isLoggedIn,rideController.end_otp_request);

module.exports = router;

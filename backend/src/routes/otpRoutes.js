const express=require("express");
const router=express.Router();
const {sendOtp,verifyOtp}=require("../utilities/verifyOtp");

router.post('/send-otp', sendOtp);
router.post("/verify-phone",verifyOtp);

module.exports=router;
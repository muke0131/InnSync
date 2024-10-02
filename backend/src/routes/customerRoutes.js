const {checkInCustomer,verifyPhone}=require("../controllers/customerControllers");
const sendMessage=require("../controllers/phoneVerify")
const axios=require("axios")

const express=require("express");

const router=express.Router();

router.post("/check-in",checkInCustomer);

let newOtp;
let mobile="6398927020"

router.get('/verify-phone',async (req,res)=>{
    newOtp=await sendMessage(mobile,res);
    res.status(200).send({
        otp:newOtp
    });
})

router.post('/send-otp', async (req, res) => {
    try {
      const mobileNumber = req.body.mobileNumber;
      const otp = Math.floor(100000 + Math.random() * 900000);
      const response = await axios.get('https://www.fast2sms.com/dev/bulk', {
        params: {
          authorization: process.env.FAST2SMS_API_KEY,
          variables_values: `Your OTP is ${otp}`,
          route: 'otp',
          numbers: mobileNumber
        }
      });
      res.json({ success: true, message: 'OTP sent successfully!' });
    } catch (error) {
      console.error('Error sending OTP:', error);
      res.status(500).json({ success: false, message: 'Failed to send OTP.' });
    }
  });

router.post("/verify-phone",(req,res)=>{
    const {otp}=req.body;
    console.log(otp);
    if(otp && newOtp && otp==newOtp){
        res.status(200).send({
            message:"Verified"
        });
    }
    else{
        res.status(400).send({
            message:"you have enterd the wrong otp"
        })
    }
});

module.exports=router;
const sendMessage=require("./sendOtp")
const axios=require("axios")

let newOtp;

const sendOtp=async (req,res)=>{
    const mobileNumber = req.body.mobileNumber;
    newOtp=await sendMessage(mobileNumber,res);
    res.status(200).send({
        otp:newOtp
    });
}


const verifyOtp=(req,res)=>{
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
}

module.exports={sendOtp,verifyOtp};
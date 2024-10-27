const otplib = require("otplib");
const axios=require("axios");

const secret = otplib.authenticator.generateSecret();

const token = otplib.authenticator.generate(secret);

const sendMessage = async (mobile, res, next) =>{
 
  const response = await axios.get(`https://www.fast2sms.com/dev/bulkV2?authorization=${process.env.FAST2SMS_API_KEY}&variables_values=${token}&route=otp&numbers=${mobile}` );

  console.log(response);

  return token;
};

module.exports = sendMessage;

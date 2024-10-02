const mongoose=require("mongoose");

const customerSchema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    aadharNumber:{
        type:String,
        required:true,
        unique:true
    },
    phoneNumber:{
        type:String,
        required:true
    },
    otpVerified:{
        type:Boolean,
        default:false
    }
,
},
{
    timestamps:true,
});

const Customer=mongoose.model('Customer',customerSchema);;

module.exports=Customer;
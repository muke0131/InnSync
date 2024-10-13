const mongoose=require("mongoose");

const customerSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
    },

    phoneNumber:{
        type:String,
        required:true
    },
    address:{
        type:String,

    },
    idType:{
        type:String,
        required:true,

    },
    idNumber:{
        type:String,
        required:true,  
    },
    idImagePath:{
        type:String
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

const Customer=new mongoose.model('Customer',customerSchema);;

module.exports=Customer;
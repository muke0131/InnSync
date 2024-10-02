const Customer=require("../models/customerModel");
const axios=require("axios");

exports.checkInCustomer=async (req,res)=>{
    const {name,aadharNumber,phoneNumber}=req.body;
    try{
        const customer=new Customer({name,phoneNumber,aadharNumber});
        await customer.save();
        res.status(201).json(customer);
    }
    catch(err){
            res.status(500).json({
                error:err.message
            });
    }
}


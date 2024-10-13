const CheckIn=require("../models/checkInModel");
const axios=require("axios");

const checkIn=async (req,res)=>{
    const {room,category,price,checkIn,contact,aadharNo,checkIn_date_time,checkOut_date_time,days,amount}=req.body;

    try{
        const newCheckIn=new CheckIn({room,category,price,checkIn,contact,aadharNo,checkIn_date_time,checkOut_date_time,days,amount});

    await newCheckIn.save();
    res.status(200).json({
        newCheckIn
    })
    }
    catch(err){
        res.status(500).json({
            error:err.message
        })
    }
}


const editCheckIn=async (req,res)=>{
    const {room,category,price,checkIn,contact,aadharNo,checkIn_date_time,checkOut_date_time,days,amount}=req.body;

    try{
        const updated=await CheckIn.findOneAndUpdate({room},{
            room,category,price,checkIn,contact,aadharNo,checkIn_date_time,checkOut_date_time,days,amount
        });

    res.status(200).json({
        updated
    })
    }
    catch(err){
        res.status(500).json({
            error:err.message
        })
    }

}


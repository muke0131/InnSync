const mongoose=require("mongoose");

const paymentSchema=new mongoose.Schema({
    bookingId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Bookings',
        required:true
    },
    amount:{
        type:Number,
        required:true
    },
    paymentMethod:{
        type:String,
        required:true
    },
    transactionId:{
        type:String
    },
    status:{
        type:String,
        enum:['pending','completed','failed'],
        required:true
    },
    paidAt:{
        type:Date
    }
},
{
    timestamps:true
})
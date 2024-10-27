const mongoose=require("mongoose");

const bookingSchema=new mongoose.Schema({
    roomId:{
        type:mongoose.Schema.Types.ObjectId ,
        ref:'Room',
        required:true
    },
    customerId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Customer',
        required:true
    },
    checkInDate:{
        type:Date,
        required:true
    },
    checkOutDate:{
        type:Date
    },
    numberOfguests:{
        type:Number,
        required:true
    },
    totalPrice:{
        type:Number,
        required:true
    },
    status:{
        type:String,
        enum:['confirmed','checked-in','checked-out','cancelled']
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
},{
    timestamps:true
});

const Booking=new mongoose.model('Booking',bookingSchema);

module.exports=Booking;
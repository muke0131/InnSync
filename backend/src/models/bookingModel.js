const mongoose=require("mongoose");

const bookingSchema=new mongoose.Schema({
    roomId:{
        type:mongoose.Schema.Types.ObjectId ,
        ref:'Rooms',
        required:true
    },
    customerId:{
        type:mongoos.Schema.Types.ObjectId,
        ref:'Customers',
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
        type:mongoose.Schema.type.ObjectId,
        ref:'Users'
    }
},{
    timestamps:true
});

const Booking=new mongoose.model('Booking',bookingSchema);

module.exports=Booking;
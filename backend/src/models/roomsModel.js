const mongoose=require("mongoose");

const roomSchema=new mongoose.Schema({
    roomNumber:{
        type:Number,
        required:true
    },
    category:{
        type:String,
        enum:['standard','deluxe','suite'],
        required:true,
        
    },
    capacity:{
        type:Number,
        required:true
    },
    pricePerNight:{
        type:Number,
        required:true
    },
    amenities:{
        type:[String]
    },
    status:{
        type:String,
        enum:['available','ocuppied','maintenance'],
        required:true,
        default:'available'
    },
},{
    timestamps:true
});

const Room=new mongoose.model("Room",roomSchema);

module.exports=Room;
const mongoose=require("mongoose");
const dotenv=require("dotenv");

dotenv.config();
const URI=process.env.MONGODB_URI;
const connectToDb=async ()=>{
    try{
        await mongoose.connect(URI);

        console.log("MongoDB Connected");
    }
    catch(err){
        console.error("MongoDb connection Error :",err);
        process.exit(1);
    }
}

module.exports=connectToDb;

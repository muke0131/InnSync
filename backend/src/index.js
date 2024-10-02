const express=require("express");
const bodyParser=require("body-parser");
const dotenv=require("dotenv");
const router=require("./routes/customerRoutes");
const connectToDb=require("./config/db");

dotenv.config();

const app=express();
const PORT=process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.get("/",(req,res)=>{
    res.send("Welcome to InnSync");
})

app.use('/api/customers',router);


connectToDb();
app.listen(PORT,()=>{
    console.log(`Server listening on the port http://localhost:${PORT}`);
})
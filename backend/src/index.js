const express=require("express");
const bodyParser=require("body-parser");
const dotenv=require("dotenv");
const customerRoutes=require("./routes/customerRoutes");
const userRoutes=require("./routes/userRoutes");
const roomRoutes=require("./routes/roomRoutes");
const paymentRoutes=require("./routes/paymentRoutes");
const bookingRoutes=require("./routes/bookingRoutes");
const otpRoutes=require("./routes/otpRoutes");
const connectToDb=require("./config/db");
const cookieParser = require('cookie-parser');
const cors=require("cors");

dotenv.config();

const app=express();
const PORT=process.env.PORT || 3000;

const corsOptions = {
    origin: 'http://localhost:5173', 
    credentials: true,
  };
  
app.use(cors(corsOptions));  
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.get("/",(req,res)=>{
    res.send("Welcome to InnSync");
})

app.use('/api/user',userRoutes);
app.use('/api/room',roomRoutes);
app.use('/api/customer',customerRoutes);
app.use('/api/booking',bookingRoutes);
app.use('/api/payment',paymentRoutes);
app.use('/api/otp',otpRoutes);
app.get('/download/:filename', (req, res) => {
  const file = `./invoices/${req.params.filename}`;
  res.download(file, (err) => {
    if (err) {
      console.error("Error downloading file:", err);
      res.status(404).send("File not found or cannot be accessed");
    }
  });
});

connectToDb();
app.listen(PORT,()=>{
    console.log(`Server listening on the port http://localhost:${PORT}`);
})
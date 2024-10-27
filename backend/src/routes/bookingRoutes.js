const express=require("express");
const {createBooking,getAllBookings,getBookingById,updateBooking,cancelBooking,checkInCustomer,checkOutCustomer}=require("../controllers/bookingControllers");
const router=express.Router();

router.post("/",createBooking);
router.get("/",getAllBookings);
router.get("/:id",getBookingById);
router.put("/:id",updateBooking);
router.delete("/:id",cancelBooking);
router.post("/:id/check-in",checkInCustomer);
router.post("/:id/check-out",checkOutCustomer);


module.exports=router;
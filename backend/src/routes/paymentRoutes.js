const express=require("express");
const router=express.Router();

const {createPayment,getAllPayments,getPaymentById,updatePayment,refundPayment,getPaymentsByBooking,}=require("../controllers/paymentsController");

router.post("/",createPayment);
router.get("/",getAllPayments);
router.get("/:id",getPaymentById);
router.put("/:id",updatePayment);
router.post('/:id/refund', refundPayment);

module.exports = router;
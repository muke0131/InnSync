const express=require("express");
const {createCustomer,getAllCustomers,getCustomerById,updateCustomer,deleteCustomer,uploadIdImage}=require("../controllers/customerControllers");
const router=express.Router();
const {uploadMiddleware}=require("../middlewares/uploadMiddleware");

router.post("/",createCustomer);
router.get("/",getAllCustomers);
router.get("/:id",getCustomerById);
router.put("/:id",updateCustomer);
router.delete("/:id",deleteCustomer);
router.post("/:id/upload-id",uploadMiddleware.single('file'),uploadIdImage);

module.exports=router;
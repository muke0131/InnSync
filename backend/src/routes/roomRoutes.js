const express=require("express");
const {createRoom,getAllRooms,getRoomById,updateRoom,deleteRoom,getAvailableRooms}=require("../controllers/roomController");
const {authMiddleware}=require("../middlewares/authMiddleware");
const router=express.Router();

router.post("/",createRoom);
router.get("/",getAllRooms);
router.get("/getRoom/:id",getRoomById);
router.put("/:id",updateRoom);
router.delete("/:id",deleteRoom);
router.get("/available",getAvailableRooms);

module.exports=router;
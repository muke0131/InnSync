const express=require("express");
const {register,login,getUserProfile,updateUserProfile,getAllUsers,deleteUser}=require("../controllers/userControllers");
const {authMiddleware}=require("../middlewares/authMiddleware");

const router=express.Router();

router.post("/register",register);
router.post("/login",login);
router.get("/profile",authMiddleware(),getUserProfile);
router.put("/profile",authMiddleware(),updateUserProfile);
router.get("/",authMiddleware(["admin"]),getAllUsers);
router.delete("/:id",authMiddleware(["admin"]),deleteUser);

module.exports=router;
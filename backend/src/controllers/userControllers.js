const User = require("../models/userModel");
const bcryptjs = require("bcrypt");
const jwt = require("jsonwebtoken");

// register new user
exports.register = async (req, res) => {
  try {
    const { username, contactNo, email, password, confirmPassword, role } =
      req.body;

    if (
      !username ||
      !contactNo ||
      !email ||
      !password ||
      !confirmPassword ||
      !role
    ) {
      return res.status(404).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (password != confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Confirm Password is different from password",
      });
    }
    const userExist = await User.findOne({ email: email });

    if (userExist) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    const newUser = await User.create({
      username,
      contactNo,
      email,
      password: hashedPassword,
      role,
    });

    return res.status(200).json({
      success: true,
      message: "User is Registered Successfully",
      newUser,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(404).json({
        success: false,
        message: "All fields are required",
      });
    }

    const userExist = await User.findOne({ email });

    if (!userExist) {
      return res.status(404).json({
        success: false,
        message: "User is not registered",
      });
    }

    const hashedPassword = userExist.password;
    const validPass = await bcryptjs.compare(password, hashedPassword);
    if (validPass) {
      const payload = {
        email: userExist.email,
        id: userExist._id,
        role: userExist.role,
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
        expiresIn: "2h",
      });
      userExist.token = token;
      userExist.password = undefined;

      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', 
        sameSite: 'strict' 
      };
      res.cookie('token', token, options).status(200).json({
        success: true,
        token,
        user: userExist
      });
      
      
    } else {
      return res.status(401).json({
        success: false,
        message: "Password is Incorrect",
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getUserProfile = async (req, res) => {
    console.log(req.user);
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const { username, email } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { username, email },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "User updated successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

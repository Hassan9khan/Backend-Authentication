import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import fs from "fs";
import cloudinary from "cloudinary";
import nodemailer from "nodemailer";

// Nodemailer Configuration
const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: "chauncey.price@ethereal.email",
    pass: "u3HsE8smhERnHQMbuD",
  },
});

// JWT Token Generators
const generateAccessToken = (user) => {
  return jwt.sign({ email: user.email }, process.env.ACCESS_JWT_SECRET, {
    expiresIn: "6h",
  });
};

const generateRefreshToken = (user) => {
  return jwt.sign({ email: user.email }, process.env.REFRESH_JWT_SECRET, {
    expiresIn: "7d",
  });
};

// Cloudinary Configuration
cloudinary.config({
  cloud_name: "dwulca9py",
  api_key: "897861889527989",
  api_secret: "-iBNSHRwRZfnkyAoYQ0LJ3dAYqY",
});

// Upload Image to Cloudinary
const uploadImageToCloud = async (localpath) => {
  try {
    const uploadResult = await cloudinary.uploader.upload(localpath, {
      resource_type: "auto",
    });
    fs.unlinkSync(localpath); 
    return uploadResult.url;
  } catch (error) {
    console.error("Error uploading image:", error);
    fs.unlinkSync(localpath); 
    return null;
  }
};

// Upload Image
const uploadImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No image file uploaded" });
  }

  try {
    const uploadResult = await uploadImageToCloud(req.file.path);

    if (!uploadResult) {
      return res.status(500).json({ message: "Error occurred while uploading image" });
    }

    res.status(200).json({
      message: "Image uploaded successfully",
      url: uploadResult,
    });
  } catch (error) {
    console.error("Error in uploadImage:", error);
    res.status(500).json({ message: "Error occurred while uploading image" });
  }
};

// Register User
const registerUser = async (req, res) => {
  const { email, password, username, role } = req.body;

  if (!email || !password || !username) {
    return res.status(400).json({ message: "Fields are required" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already registered" });
    }

    const newUser = await User.create({
      username,
      email,
      password,
      role: role || "customer",
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("Error in registerUser:", error);
    res.status(500).json({ message: "Error registering user", error: error.message });
  }
};

// Login User
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Fields are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = generateAccessToken(user);

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error in loginUser:", error);
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};

// Get All Users

const getAllUser = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({ message: "Users get successfully", users });
  } catch (error) {
    console.error("Error in getAllUser:", error);
    res.status(500).json({ message: "Error getting users", error: error.message });
  }
};

const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User get successfully", user });
  } catch (error) {
    console.error("Error in getUserById:", error);
    res.status(500).json({ message: "Error getting user", error: error.message });
  }
};

const logoutUser = async (req, res) => {
  res.clearCookie("refreshToken");
  res.json({ message: "Logged out successfully" });
};

const refreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ message: "No refresh token found" });
  }

  try {
    const decodedToken = jwt.verify(refreshToken, process.env.REFRESH_JWT_SECRET);
    const user = await User.findOne({ email: decodedToken.email });

    if (!user) {
      return res.status(404).json({ message: "Invalid token" });
    }

    const newAccessToken = generateAccessToken(user);
    res.status(200).json({ message: "Access token generated", accessToken: newAccessToken });
  } catch (error) {
    console.error("Error in refreshToken:", error);
    res.status(500).json({ message: "Error refreshing token", error: error.message });
  }
};

export {
  registerUser,
  loginUser,
  getAllUser,
  getUserById,
  logoutUser,
  refreshToken,
  uploadImage,
};

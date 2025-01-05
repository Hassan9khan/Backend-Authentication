import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cloudinary from "cloudinary";
import fs from "fs"


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


// Configuration
cloudinary.config({
  cloud_name: "dwulca9py",
  api_key: "897861889527989",
  api_secret: "-iBNSHRwRZfnkyAoYQ0LJ3dAYqY",
});

// Upload an image
const uploadImageToCloud = async (localpath) => {
  try {
    const uploadResult = await cloudinary.uploader.upload(localpath, {
      resource_type: "auto",
    });
    fs.unlinkSync(localpath);
    return uploadResult.url;
  } catch (error) {
    fs.unlikeSync(localpath);
    return null;
  }
};

//upload image

const uploadImage = async (req, res) => {
  if (!req.file)
    return res.status(400).json({
      message: "no image file uploaded ",
    });

  try {
    const uploadResult = await uploadImageToCloud(req.file.path);

    if (!uploadResult)
      return res.status(500).json({
        message: "error occured while uploading image",
      });

    res.json({
      message: "image upload successfully",
      url: uploadResult,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "error occured while uploading image" });
  }
};

//  register user

const registerUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email) return res.status(400).json({ message: "email required" });
  if (!password) return res.status(400).json({ message: "password required" });

  const user = await User.findOne({ email: email });
  if (user)
    return res.status(401).json({
      message: "user already registered",
    });

  const createUser = await User.create({
    email,
    password,
  });
  res.json({
    message: "user registered successfully",
    data: createUser,
  });
};

// lOGIN USER
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email) return res.status(400).json({ message: "email required" });
  if (!password) return res.status(400).json({ message: "password required" });

  // Email exists or not
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "no user found" });

  //compare password  with bcrpyt
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(400).json({ message: "incorrect password" });
  }

  //GENERATE TOKEN
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  // COOKIES
  res.cookie("refreshToken", refreshToken, { http: true, secure: false });

  res.json({
    message: "logged in successfully",
    accessToken,
    refreshToken,
    data: user,
  });
};

// LOGOUT USER
const logoutUser = async (req, res) => {
  res.clearCookie("refreshToken");
  res.json({ message: "logout successfully" });
};

// RefreshToken
const refreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
  if (!refreshToken)
    return res.status(401).json({ message: "no refresh token found" });

  const decodedToken = jwt.verify(refreshToken , process.env.REFRESH_JWT_SECRET)

  const user = await User.findOne({email : decodedToken.email})

  if(!user) return res.status(404).json({message : "invalid token"})

    const generateToken = generateAccessToken(user)
    res.json({ message: "access token generated" , accessToken: generateToken,})

};

export { registerUser, loginUser, logoutUser , refreshToken , uploadImage };

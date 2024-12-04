import User from "../models/userModel.js"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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
const logoutUser = async (req , res) => {
  res.clearCookie("refreshToken")
  res.json({message: "logout successfully"})
}

export { registerUser, loginUser , logoutUser };

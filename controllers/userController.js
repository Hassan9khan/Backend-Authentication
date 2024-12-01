import express from "express"
import asyncHandler from "express-async-handler"
import User from "../models/userModel.js";
import bcrypt from "bcrypt"

const registerUser = asyncHandler(async (req , res) => {
    console.log(req.body);
    
    const { username , email , password } = req.body;    
    if(!username || !email || !password) {
        res.status(400).json({
            message: "all field are required"
        })
    }

    const userAvailable = await User.findOne( email )
    if(userAvailable){
        res.status(400).json({
            message: "user already registered"
        })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    console.log("Hashed Password : " , hashedPassword);
    

    res.status(201).json({
        message: "register the user"
    })
})

const loginUser = asyncHandler(async (req , res) => {
    // console.log(req.body);
    
    res.status(201).json({
        message: "login the user"
    })
})

const currentUser = asyncHandler(async (req , res) => {
    res.status(200).json({
        message: "current the user"
    })
})
export {registerUser , loginUser , currentUser}
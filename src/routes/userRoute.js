import express from "express";
import { currentUser, loginUser, registerUser } from "../controllers/userController";

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

// router.get("/current", currentUser);

export default router;

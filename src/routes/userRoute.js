import express from "express";
import { loginUser, logoutUser, refreshToken, registerUser, uploadImage } from "../controllers/userController.js";
import { upload } from "../middleware/multerMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/logout", logoutUser);

router.post("/refreshtoken", refreshToken);


router.post("/uploadimage", upload.single('image') , uploadImage);
export default router;

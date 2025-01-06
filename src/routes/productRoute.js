
import express from "express";
import {
  getProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/productsController.js";

const router = express.Router();

router.get("/getproducts", getProducts); 
router.post("/createproduct", createProduct); 
router.get("/singleproduct/:id", getProductById); 
router.put("/updateproduct/:id", updateProduct); 
router.delete("/deleteproduct/:id", deleteProduct); 

export default router;
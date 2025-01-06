import express from "express";
import {
    createOrder,
    getAllOrders,
    getOrderById,
    updateOrderStatus,
    deleteOrder,
} from "../controllers/orderController.js";

const router = express.Router();

router.post("/createorder", createOrder);
router.get("/getallorders", getAllOrders);
router.get("/singleorder/:id", getOrderById);
router.put("/updatestatus/:id", updateOrderStatus);
router.delete("/deleteorder/:id", deleteOrder);

export default router;

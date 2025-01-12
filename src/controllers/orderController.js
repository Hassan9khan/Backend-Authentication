import Order from "../models/orderModel.js";
import Product from "../models/productsModel.js";
import User from "../models/userModel.js";

// Create order
const createOrder = async (req, res) => {
  const { user, products, totalPrice } = req.body;

  if (
    !user ||
    !products ||
    !Array.isArray(products) ||
    products.length === 0 ||
    !totalPrice
  ) {
    return res
      .status(400)
      .json({ message: "Invalid or incomplete order details." });
  }

  try {
    const userExists = await User.findById(user);
    if (!userExists) {
      return res.status(404).json({ message: "User not found." });
    }
    for (const item of products) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res
          .status(404)
          .json({ message: `Product not found for ID: ${item.product}` });
      }
      if (item.quantity <= 0) {
        return res.status(400).json({
          message: `Invalid quantity for product ID: ${item.product}`,
        });
      }
    }
    // Create the order
    const newOrder = await Order.create({ user, products, totalPrice });

    res.status(201).json({
      message: "Order created successfully",
      order: newOrder,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating order", error: error.message });
  }
};

// Get all orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "username email")
      .populate("products.product", "name price");
    res.status(200).json({ message: "Orders recieved successfully", orders });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error recieving orders", error: error.message });
  }
};

// Get a single order by ID
const getOrderById = async (req, res) => {
  const { id } = req.params;

  try {
    const order = await Order.findById(id)
      .populate("user", "username email")
      .populate("products.product", "name price");
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json({ message: "Order recieved successfully", order });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error recieving order", error: error.message });
  }
};

// Update an order's status
const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatus = ["pending", "completed", "shipped", "cancelled"];
  if (!validStatus.includes(status)) {
    return res.status(400).json({ message: "Invalid status value" });
  }

  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate("user", "username email");
    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json({
      message: "Order status updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating order status", error: error.message });
  }
};

// Delete an order
const deleteOrder = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedOrder = await Order.findByIdAndDelete(id);
    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }
    res
      .status(200)
      .json({ message: "Order deleted successfully", order: deletedOrder });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting order", error: error.message });
  }
};

export {
  createOrder,
  getAllOrders,
  deleteOrder,
  updateOrderStatus,
  getOrderById,
};

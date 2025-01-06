import Product from "../models/productsModel.js";
import User from "../models/userModel.js";

const createProduct = async (req, res) => {
  const { name, description, price, user } = req.body;
  if (!name || !description || !price || !user) {
    return res.status(400).json({ message: "Fields are required" });
  }

  try {
    const userExists = await User.findById(user);
    if (!userExists) {
      return res.status(404).json({ message: "User not found" });
    }

    const newProduct = await Product.create({ name, description, price, user });

    res.status(201).json({
      message: "Product created",
      product: newProduct,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating product",
      error: error.message,
    });
  }
};

//Get All Product
const getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("user", "username email");
    res.status(200).json({
      message: "Product received",
      products,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error getting products",
      error: error.message,
    });
  }
};

//Get single product
const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id).populate(
      "user",
      "username email"
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({
      message: "Product getting Successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({ message: "Error getting product", error });
  }
};

const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price } = req.body;

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { name, description, price },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "product not found" });
    }

    res.status(200).json({
        message: "product updated successfully",
        product: updateProduct,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating product", error });
  }
};

const deleteProduct = async (req, res) => {
    const { id } = req.params.id
  try {
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product", error });
  }
};

export {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};

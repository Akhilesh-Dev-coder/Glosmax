const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const upload = require("../middleware/uploadMiddleware");

// Create a new product
router.post("/", upload.array("images", 10), productController.createProduct);

// Get all products
router.get("/", productController.getAllProducts);

// Update a product
router.put("/:id", upload.array("images", 10), productController.updateProduct);

// Delete a product
router.delete("/:id", productController.deleteProduct);

module.exports = router;

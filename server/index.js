require("dotenv").config();
const express = require("express");
// Trigger restart for .env update
const multer = require("multer");

const app = express();
const cors = require("cors");

app.use(cors());
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const reviewRoutes = require("./routes/reviewRoutes");

app.use(express.json());
app.use("/auth", authRoutes);
app.use("/products", productRoutes);
app.use("/reviews", reviewRoutes);
const orderRoutes = require("./routes/orderRoutes");
app.use("/orders", orderRoutes);

const cartRoutes = require("./routes/cartRoutes");
app.use("/cart", cartRoutes);

// Serve uploaded images
const path = require("path");
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ success: false, error: err.message });
  }
  res
    .status(500)
    .json({ success: false, error: err.message || "Something went wrong!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

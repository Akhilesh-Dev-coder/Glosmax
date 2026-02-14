require("dotenv").config();
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");

const app = express();

// UPDATED: Add your new custom domain to CORS
app.use(
  cors({
    origin: [
      "https://glosmax.in", // ← ADD THIS (your new domain)
      "https://www.glosmax.in", // ← ADD THIS (www version)
      "https://glosmax.netlify.app", // Keep this (Netlify URL still works)
      "http://localhost:5173", // Keep for local development
      "http://localhost:3000", // Keep for local development
    ],
    credentials: true,
  }),
);

app.use(express.json());

// Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const orderRoutes = require("./routes/orderRoutes");
const cartRoutes = require("./routes/cartRoutes");

app.use("/auth", authRoutes);
app.use("/products", productRoutes);
app.use("/reviews", reviewRoutes);
app.use("/orders", orderRoutes);
app.use("/cart", cartRoutes);

// Health check endpoints
app.get("/", (req, res) => {
  res.json({ status: "Server is running!", timestamp: new Date() });
});

app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

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

// Listen on 0.0.0.0 for Hostinger
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});

const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");

router.post("/create-order", orderController.createOrder);
router.post("/verify-payment", orderController.verifyPayment);

// Admin Routes
router.get(
  "/stats",
  verifyToken,
  verifyAdmin,
  orderController.getDashboardStats,
);
router.get("/", verifyToken, verifyAdmin, orderController.getAllOrders);
router.put(
  "/:id/status",
  verifyToken,
  verifyAdmin,
  orderController.updateOrderStatus,
);
router.delete("/:id", verifyToken, verifyAdmin, orderController.deleteOrder);

module.exports = router;

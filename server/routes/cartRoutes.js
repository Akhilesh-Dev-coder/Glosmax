const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const authMiddleware = require("../middleware/authMiddleware");

// Sync cart
router.post("/sync", authMiddleware.verifyToken, cartController.syncCart);

module.exports = router;

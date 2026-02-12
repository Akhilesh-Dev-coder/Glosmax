const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");

const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/verify", authController.verifySession);

// Admin Routes
router.get("/users", verifyToken, verifyAdmin, authController.getAllUsers);
router.delete(
  "/users/:id",
  verifyToken,
  verifyAdmin,
  authController.deleteUser,
);
router.put(
  "/users/:id/role",
  verifyToken,
  verifyAdmin,
  authController.updateUserRole,
);

module.exports = router;

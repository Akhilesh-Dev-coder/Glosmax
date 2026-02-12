const db = require("../database/db");

exports.syncCart = (req, res) => {
  const userId = req.userId; // From authMiddleware
  const { cart } = req.body;

  if (!cart) {
    return res
      .status(400)
      .json({ success: false, error: "Cart data is required" });
  }

  // Ensure cart is a valid JSON string or convert it
  let cartString = cart;
  if (typeof cart !== "string") {
    cartString = JSON.stringify(cart);
  }

  db.run(
    `UPDATE users SET cart = ? WHERE id = ?`,
    [cartString, userId],
    function (err) {
      if (err) {
        return res.status(500).json({ success: false, error: err.message });
      }
      res.json({ success: true, message: "Cart synced successfully" });
    },
  );
};

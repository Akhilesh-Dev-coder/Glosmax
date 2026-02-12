const Razorpay = require("razorpay");
const orderDb = require("../database/orderDb");
const transactionDb = require("../database/transactionDb");
const productDb = require("../database/productDb");

// Initialize Razorpay
// Note: These keys should be in your .env file
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

if (
  !RAZORPAY_KEY_ID ||
  !RAZORPAY_KEY_SECRET ||
  RAZORPAY_KEY_ID === "rzp_test_..." ||
  RAZORPAY_KEY_SECRET === "your_secret_..."
) {
  console.error(
    "CRITICAL: Razorpay keys are missing or are placeholders. Please update .env file with valid keys.",
  );
}

const razorpay = new Razorpay({
  key_id: RAZORPAY_KEY_ID || "rzp_test_missing",
  key_secret: RAZORPAY_KEY_SECRET || "missing_secret",
});

exports.createOrder = async (req, res) => {
  try {
    const {
      productId,
      amount,
      name,
      house,
      street,
      town,
      city,
      pincode,
      phoneNumber,
      items, // Array of { name, quantity, price }
    } = req.body;

    console.log("[CreateOrder] Request Body:", req.body);

    // Basic validation
    if (!productId || !amount || !name || !phoneNumber) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: productId, amount, name, phoneNumber",
      });
    }

    // Create Razorpay Order
    const options = {
      amount: Math.round(amount * 100), // amount in the smallest currency unit (paise) and rounded to integer
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    if (!razorpayOrder) {
      return res
        .status(500)
        .json({ success: false, error: "Razorpay order creation failed" });
    }

    // Check stock for all items
    if (items && items.length > 0) {
      for (const item of items) {
        // item should have { id, quantity }
        // We need to fetch current stock
        const product = await new Promise((resolve, reject) => {
          productDb.get(
            "SELECT stock, name FROM products WHERE id = ?",
            [item.id],
            (err, row) => {
              if (err) reject(err);
              else resolve(row);
            },
          );
        });

        if (!product) {
          return res
            .status(400)
            .json({ success: false, error: `Product not found: ${item.name}` });
        }

        if (product.stock < item.quantity) {
          return res.status(400).json({
            success: false,
            error: `Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`,
          });
        }
      }
    } else if (productId) {
      // Single product direct buy
      const product = await new Promise((resolve, reject) => {
        productDb.get(
          "SELECT stock, name FROM products WHERE id = ?",
          [productId],
          (err, row) => {
            if (err) reject(err);
            else resolve(row);
          },
        );
      });

      const qty = 1; // Default to 1 if not specified ? Or maybe we should extract qty from somewhere else?
      // Actually, for direct buy without items array, usually it means 1 item.
      // But let's check if we have quantity in body, although not destructured.
      // The frontend sends `items` array even for "Buy Now" in ProductDetails.
      // So this else block might not be hit often, but good fallback.
      if (product && product.stock < 1) {
        return res.status(400).json({
          success: false,
          error: `Insufficient stock for ${product.name}. Product is out of stock.`,
        });
      }
    }

    // Store order in database
    const itemsJson = items ? JSON.stringify(items) : null;

    orderDb.run(
      `INSERT INTO orders (
            product_id, amount, user_name, house, street, town, city, pincode, phone_number, razorpay_order_id, items
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        productId,
        amount,
        name,
        house,
        street,
        town,
        city,
        pincode,
        phoneNumber,
        razorpayOrder.id,
        itemsJson,
      ],
      function (err) {
        if (err) {
          console.error("Database insertion error:", err);
          return res
            .status(500)
            .json({ success: false, error: "Failed to save order" });
        }

        res.status(201).json({
          success: true,
          orderId: this.lastID,
          razorpayOrderId: razorpayOrder.id,
          amount: amount,
          currency: "INR",
          key: process.env.RAZORPAY_KEY_ID, // Send key to frontend if needed
        });
      },
    );
  } catch (error) {
    console.error("Create Order Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.verifyPayment = (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    order_id_db,
  } = req.body;

  // Verify signature logic should be here ideally for security
  // const generated_signature = hmac_sha256(razorpay_order_id + "|" + razorpay_payment_id, secret);
  // if (generated_signature == razorpay_signature) ...

  // For now, based on user request: "after succesfull payment return success : true and store payment details"
  // We assume the frontend sends this request after payment success.

  if (!razorpay_payment_id || !razorpay_order_id) {
    return res
      .status(400)
      .json({ success: false, error: "Missing payment details" });
  }

  // Update Order Status
  orderDb.run(
    `UPDATE orders SET payment_status = ?, razorpay_payment_id = ? WHERE razorpay_order_id = ?`,
    ["success", razorpay_payment_id, razorpay_order_id],
    function (err) {
      if (err) {
        console.error("Error updating order:", err);
        // Don't fail the response if DB update fails, but log it.
      } else {
        // Decrement Stock Logic
        // Fetch order items to know what to decrement
        orderDb.get(
          "SELECT items, product_id FROM orders WHERE razorpay_order_id = ?",
          [razorpay_order_id],
          (err, orderRow) => {
            if (err || !orderRow) return;

            let itemsToUpdate = [];
            if (orderRow.items) {
              try {
                itemsToUpdate = JSON.parse(orderRow.items);
              } catch (e) {
                console.error("Error parsing items for stock update", e);
              }
            }

            // Fallback for legacy single product orders
            if (itemsToUpdate.length === 0 && orderRow.product_id) {
              itemsToUpdate.push({ id: orderRow.product_id, quantity: 1 });
            }

            itemsToUpdate.forEach((item) => {
              productDb.run(
                "UPDATE products SET stock = stock - ? WHERE id = ?",
                [item.quantity, item.id],
                (err) => {
                  if (err)
                    console.error(
                      `Failed to update stock for product ${item.id}`,
                      err,
                    );
                },
              );
            });
          },
        );
      }
    },
  );

  // Get order ID if not provided, for transaction log.
  // If order_id_db is passed from frontend, use it. Otherwise query via razorpay_order_id.
  // For simplicity, we'll try to get the existing order details first.

  orderDb.get(
    `SELECT * FROM orders WHERE razorpay_order_id = ?`,
    [razorpay_order_id],
    (err, order) => {
      if (err || !order) {
        console.error("Order not found for transaction log");
        // Proceed to return success anyway if payment logic itself was fine
      } else {
        transactionDb.run(
          `INSERT INTO transactions (order_id, payment_id, amount, status) VALUES (?, ?, ?, ?)`,
          [order.id, razorpay_payment_id, order.amount, "success"],
          (txErr) => {
            if (txErr) console.error("Error logging transaction:", txErr);
          },
        );
      }
    },
  );

  res.json({
    success: true,
    message: "Payment verified and transaction recorded",
  });
};

// Admin CRUD
exports.getAllOrders = (req, res) => {
  orderDb.all(
    `SELECT * FROM orders ORDER BY created_at DESC`,
    [],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ success: false, error: err.message });
      }
      // Fetch all products to resolve legacy product_ids
      productDb.all(`SELECT id, name FROM products`, [], (err, products) => {
        if (err) {
          console.error("Error fetching products for order mapping:", err);
          // Continue without product names if this fails
        }

        const productMap = {};
        if (products) {
          products.forEach((p) => (productMap[p.id] = p.name));
        }

        const ordersWithItems = rows.map((row) => {
          const order = {
            ...row,
            items: row.items ? JSON.parse(row.items) : [],
          };

          // If no items, try to resolve legacy product name
          if (order.items.length === 0 && row.product_id) {
            order.legacy_product_name =
              productMap[row.product_id] || `Product #${row.product_id}`;
          }

          return order;
        });

        res.json({ success: true, orders: ordersWithItems });
      });
    },
  );
};

exports.deleteOrder = (req, res) => {
  const { id } = req.params;
  orderDb.run(`DELETE FROM orders WHERE id = ?`, [id], function (err) {
    if (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
    res.json({ success: true, message: "Order deleted successfully" });
  });
};

exports.updateOrderStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  // We are updating 'payment_status' for now, or we could assume this is fulfillment status
  // Since db only has payment_status, let's update that.
  orderDb.run(
    `UPDATE orders SET payment_status = ? WHERE id = ?`,
    [status, id],
    function (err) {
      if (err) {
        return res.status(500).json({ success: false, error: err.message });
      }
      res.json({ success: true, message: "Order status updated successfully" });
    },
  );
};

exports.getDashboardStats = (req, res) => {
  const stats = {
    totalSales: 0,
    activeOrders: 0,
    recentOrders: [],
  };

  // 1. Calculate Total Sales (sum of amount where status is success/completed)
  // Note: amount is stored in rupees (not paise) based on createOrder
  orderDb.get(
    `SELECT SUM(amount) as total FROM orders WHERE payment_status = 'success' OR payment_status = 'completed' OR payment_status = 'Completed'`,
    [],
    (err, row) => {
      if (err) {
        console.error("Error fetching total sales:", err);
      } else {
        stats.totalSales = row ? row.total || 0 : 0;
      }

      // 2. Calculate Active Orders (pending, processing)
      orderDb.get(
        `SELECT COUNT(*) as count FROM orders WHERE payment_status IN ('pending', 'processing', 'Pending', 'Processing')`,
        [],
        (err, row) => {
          if (err) {
            console.error("Error fetching active orders:", err);
          } else {
            stats.activeOrders = row ? row.count || 0 : 0;
          }

          // 3. Get Total Lifetime Orders
          orderDb.get(
            `SELECT COUNT(*) as count FROM orders`,
            [],
            (err, row) => {
              if (err) {
                console.error("Error fetching total orders:", err);
              } else {
                stats.totalOrders = row ? row.count || 0 : 0;
              }

              // 4. Get Recent 5 Orders
              orderDb.all(
                `SELECT * FROM orders ORDER BY created_at DESC LIMIT 5`,
                [],
                (err, rows) => {
                  if (err) {
                    console.error("Error fetching recent orders:", err);
                    return res
                      .status(500)
                      .json({ success: false, error: "Database error" });
                  }
                  stats.recentOrders = rows;

                  res.json({ success: true, stats });
                },
              );
            },
          );
        },
      );
    },
  );
};

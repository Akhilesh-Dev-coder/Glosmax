const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../database/db");

const SECRET_KEY = process.env.JWT_SECRET;
if (!SECRET_KEY) {
  console.error("FATAL ERROR: JWT_SECRET is not defined in .env");
  process.exit(1);
}

exports.register = (req, res) => {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    return res
      .status(400)
      .json({ success: false, error: "All fields are required" });
  }

  const hashedPassword = bcrypt.hashSync(password, 8);

  db.run(
    `INSERT INTO users (full_name, email, password) VALUES (?, ?, ?)`,
    [fullName, email, hashedPassword],
    function (err) {
      if (err) {
        if (err.message.includes("UNIQUE constraint failed")) {
          return res
            .status(400)
            .json({ success: false, error: "Email already exists" });
        }
        return res.status(500).json({ success: false, error: err.message });
      }
      res.status(201).json({
        success: true,
        message: "User registered successfully",
        userId: this.lastID,
      });
    },
  );
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, error: "Email and password are required" });
  }

  db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, user) => {
    if (err) {
      return res.status(500).json({ success: false, error: "Database error" });
    }
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid) {
      return res
        .status(401)
        .json({ success: false, token: null, error: "Invalid password" });
    }

    const token = jwt.sign({ id: user.id, admin: user.admin }, SECRET_KEY, {
      expiresIn: 86400, // 24 hours
    });

    res.status(200).json({
      success: true,
      user: {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
        admin: !!user.admin,
        cart: user.cart ? JSON.parse(user.cart) : [],
      },
      token: token,
    });
  });
};

exports.verifySession = (req, res) => {
  const tokenHeader = req.headers["authorization"];

  if (!tokenHeader) {
    return res.status(403).json({ success: false, error: "No token provided" });
  }

  const token = tokenHeader.split(" ")[1]; // Bearer <token>

  if (!token) {
    return res.status(403).json({ success: false, error: "Malformed token" });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res
        .status(401)
        .json({ success: false, error: "Unauthorized: Invalid token" });
    }

    // Fetch fresh user details from DB
    db.get(
      `SELECT id, full_name, email, admin, cart FROM users WHERE id = ?`,
      [decoded.id],
      (err, user) => {
        if (err) {
          return res
            .status(500)
            .json({ success: false, error: "Database error" });
        }
        if (!user) {
          return res
            .status(404)
            .json({ success: false, error: "User not found" });
        }

        res.status(200).json({
          success: true,
          user: {
            id: user.id,
            fullName: user.full_name,
            email: user.email,
            admin: !!user.admin,
            cart: user.cart ? JSON.parse(user.cart) : [],
          },
          message: "Session is valid",
        });
      },
    );
  });
};

exports.getAllUsers = (req, res) => {
  require("fs").appendFileSync(
    "server_debug.log",
    `[API] getAllUsers called by User ${req.userId}\n`,
  );
  db.all(`SELECT id, full_name, email, admin FROM users`, [], (err, rows) => {
    if (err) {
      require("fs").appendFileSync(
        "server_debug.log",
        `[API] getAllUsers DB Error: ${err.message}\n`,
      );
      return res.status(500).json({ success: false, error: err.message });
    }
    require("fs").appendFileSync(
      "server_debug.log",
      `[API] getAllUsers found ${rows.length} users\n`,
    );
    res.json({ success: true, users: rows });
  });
};

exports.deleteUser = (req, res) => {
  const { id } = req.params;
  db.run(`DELETE FROM users WHERE id = ?`, [id], function (err) {
    if (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
    res.json({ success: true, message: "User deleted successfully" });
  });
};

exports.updateUserRole = (req, res) => {
  const { id } = req.params;
  const { isAdmin } = req.body;
  db.run(
    `UPDATE users SET admin = ? WHERE id = ?`,
    [isAdmin ? 1 : 0, id],
    function (err) {
      if (err) {
        return res.status(500).json({ success: false, error: err.message });
      }
      res.json({ success: true, message: "User role updated successfully" });
    },
  );
};

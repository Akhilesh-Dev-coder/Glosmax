const jwt = require("jsonwebtoken");
const db = require("../database/db");

const SECRET_KEY = process.env.JWT_SECRET;

exports.verifyToken = (req, res, next) => {
  let token = req.headers["authorization"];

  if (!token) {
    return res.status(403).json({ success: false, error: "No token provided" });
  }

  if (token.startsWith("Bearer ")) {
    token = token.slice(7, token.length);
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res
        .status(401)
        .json({ success: false, error: "Unauthorized: Invalid token" });
    }
    req.userId = decoded.id;
    req.isAdmin = decoded.admin;
    next();
  });
};

exports.verifyAdmin = (req, res, next) => {
  if (!req.isAdmin) {
    return res
      .status(403)
      .json({ success: false, error: "Require Admin Role" });
  }
  next();
};

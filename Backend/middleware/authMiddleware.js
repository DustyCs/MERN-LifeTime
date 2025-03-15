const jwt = require("jsonwebtoken");
require('dotenv').config();

const JWT_SECRET = process.env.JWTKEY; // Same secret key used in authRoutes

module.exports = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ msg: "Access denied. No token provided." });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Invalid token" });
  }
};

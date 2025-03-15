require('dotenv').config();
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWTKEY; // Same secret key used in authRoutes

module.exports = (req, res, next) => {
  const token = req.header("Authorization");

  console.log("Raw Token from Header: ", token);

  if (!token) return res.status(401).json({ msg: "Access denied. No token provided." });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded.userId;

    console.log("Decoded User ID: ", req.user);

    next();
  } catch (err) {
    console.error("JWT Verification Error:", err);
    res.status(401).json({ msg: "Invalid token" });
  }
};

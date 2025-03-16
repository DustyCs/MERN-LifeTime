require('dotenv').config();
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWTKEY; // Ensure this matches the one used in authRoutes

module.exports = (req, res, next) => {
  let token = req.header("Authorization");

  console.log("Raw Token from Header:", token);

  if (!token) {
    return res.status(401).json({ msg: "Access denied. No token provided." });
  }

  // Handle "Bearer <token>" format
  if (token.startsWith("Bearer ")) {
    token = token.slice(7).trim(); // Remove "Bearer " and trim any whitespace
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("Decoded Token:", decoded);

    if (!decoded.userId) {
      return res.status(401).json({ msg: "Invalid token structure: userId missing" });
    }

    // Preserve the full decoded token and ensure userId is accessible
    req.user = decoded; 
    req.user.userId = decoded.userId; 

    console.log("User Object Assigned to req.user:", req.user);

    next();
  } catch (err) {
    console.error("JWT Verification Error:", err);
    res.status(401).json({ msg: "Invalid token" });
  }
};




// old fix
// require('dotenv').config();
// const jwt = require("jsonwebtoken");

// const JWT_SECRET = process.env.JWTKEY; // Ensure this matches the one used in authRoutes

// module.exports = (req, res, next) => {
//   let token = req.header("Authorization");

//   console.log("Raw Token from Header:", token);

//   if (!token) {
//     return res.status(401).json({ msg: "Access denied. No token provided." });
//   }

//   // Handle "Bearer <token>" format
//   if (token.startsWith("Bearer ")) {
//     token = token.slice(7).trim(); // Remove "Bearer " and trim any whitespace
//   }

//   try {
//     const decoded = jwt.verify(token, JWT_SECRET);
//     console.log("Decoded Token:", decoded);

//     if (!decoded.userId) {
//       return res.status(401).json({ msg: "Invalid token structure: userId missing" });
//     }

//     req.user = decoded.userId || decoded["userId"];
//     console.log("User ID from Token:", req.user);

//     next();
//   } catch (err) {
//     console.error("JWT Verification Error:", err);
//     res.status(401).json({ msg: "Invalid token" });
//   }
// };
const User = require('../models/User');

const adminMiddleware = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId); // assuming authMiddleware sets req.user

    if (!user || !user.isAdmin) {
      return res.status(403).json({ message: "Admin access required" });
    }

    next();
  } catch (err) {
    console.error("Admin middleware error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = adminMiddleware;
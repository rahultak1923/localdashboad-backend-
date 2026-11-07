const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Token verify karna
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      if (!req.user) {
        return res.status(401).json({ message: "User exist nahi karta" });
      }
      next();
    } catch (error) {
      return res.status(401).json({ message: "Token invalid ya expired hai" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, token missing hai" });
  }
};

// Admin role check karna
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Access denied. Sirf Admin allow hai" });
  }
};

module.exports = { protect, adminOnly };
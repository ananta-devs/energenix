const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports.auth = async (req, res, next) => {
  const token = req.header("x-auth-token");

  if (!token) {
    // Allow unauthenticated users to proceed
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.user.id).select("-password");
    next();
  } catch (err) {
    // Allow unauthenticated users to proceed even if token is invalid
    next();
  }
};

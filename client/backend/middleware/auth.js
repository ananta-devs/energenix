const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports.auth = async (req, res, next) => {
  let token;
  if (req.header("Authorization") && req.header("Authorization").startsWith("Bearer")) {
    token = req.header("Authorization").split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.user.id).select("-password");
    if (!req.user) {
        return res.status(401).json({ msg: "User not found, authorization denied" });
    }
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};

module.exports.optionalAuth = async (req, res, next) => {
  let token;
  if (req.header("Authorization") && req.header("Authorization").startsWith("Bearer")) {
    token = req.header("Authorization").split(" ")[1];
  }

  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.user.id).select("-password");
    next();
  } catch (err) {
    // If token is invalid, just proceed without req.user
    next();
  }
};

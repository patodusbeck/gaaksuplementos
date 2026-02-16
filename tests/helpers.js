const jwt = require("jsonwebtoken");

const signToken = ({ username = "admin", role = "owner", sub = "507f1f77bcf86cd799439011" } = {}) => {
  return jwt.sign({ sub, username, role }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

module.exports = { signToken };

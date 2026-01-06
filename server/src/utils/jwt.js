const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      role: user.role,
      email: user.email,
      name:user.name,
    },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );
};

module.exports = generateToken;

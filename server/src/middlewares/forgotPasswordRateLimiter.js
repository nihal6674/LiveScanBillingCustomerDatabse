const rateLimit = require("express-rate-limit");

exports.forgotPasswordRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3,
  message: {
    message: "Too many password reset requests. Try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

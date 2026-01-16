const rateLimit = require("express-rate-limit");

exports.loginRateLimiter = rateLimit({
  windowMs: 30 * 1000, // 15 minutes
  max: 3,                  // max 5 attempts per IP
  standardHeaders: true,   // RateLimit-* headers
  legacyHeaders: false,

  message: {
    message: "Too many login attempts. Please try again later.",
  },
});

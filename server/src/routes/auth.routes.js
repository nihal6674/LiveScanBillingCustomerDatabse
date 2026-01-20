const express = require("express");
const { register, login, logout,me,forgotPassword,resetPassword } = require("../controllers/auth.controller");
const {
  forgotPasswordRateLimiter,
} = require("../middlewares/forgotPasswordRateLimiter");
const {
  resetPasswordRateLimiter,
} = require("../middlewares/resetPasswordRateLimiter");
const authMiddleware = require("../middlewares/auth.middleware");
const {loginRateLimiter}= require("../middlewares/loginRateLimiter")
const router = express.Router();

router.post("/register", register);

router.post("/login",loginRateLimiter, login);
router.post("/logout", authMiddleware, logout); // protected
router.get("/me", authMiddleware, me);

router.post("/forgot-password",forgotPasswordRateLimiter, forgotPassword);
router.post("/reset-password",resetPasswordRateLimiter, resetPassword);

module.exports = router;

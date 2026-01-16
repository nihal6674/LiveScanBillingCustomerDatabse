const express = require("express");
const { register, login, logout,me } = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const {loginRateLimiter}= require("../middlewares/loginRateLimiter")
const router = express.Router();

// router.post("/register", register);

router.post("/login",loginRateLimiter, login);
router.post("/logout", authMiddleware, logout); // protected
router.get("/me", authMiddleware, me);

module.exports = router;

const bcrypt = require("bcryptjs");
const User = require("../models/User");
const generateToken = require("../utils/jwt");
const { ADMIN, STAFF } = require("../constants/roles");

// REGISTER (Admin / Staff)
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (![ADMIN, STAFF].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({ message: "Password too short" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user);

    res.cookie("token", token, {
      httpOnly: true,      // JS cannot access
      secure: false,       // true in production (HTTPS)
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.json({ message: "Login successful" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};



exports.logout = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false,      // true in production (HTTPS)
    sameSite: "lax",
  });

  return res.json({ message: "Logged out successfully" });
};

// auth.controller.js
exports.me = async (req, res) => {
  res.json(req.user);
};


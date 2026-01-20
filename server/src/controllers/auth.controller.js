const bcrypt = require("bcryptjs");
const User = require("../models/User");
const generateToken = require("../utils/jwt");
const { ADMIN, STAFF } = require("../constants/roles");
const sendEmail = require("../utils/sendEmail");

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
    let { email, password } = req.body;
    email = email.trim().toLowerCase();

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!user.active) {
      return res.status(403).json({
        message: "Invalid Credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user);

    // res.cookie("token", token, {
    //   httpOnly: true,      // JS cannot access
    //   secure: true,       // true in production (HTTPS)
    //   sameSite: "none",
    //   maxAge: 24 * 60 * 60 * 1000, // 1 day
    // });

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        active: user.active,
      },
    });


  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.logout = async (req, res) => {
  // res.clearCookie("token", {
  //   httpOnly: true,
  //   secure: true,       // must match login
  //   sameSite: "none",   // MUST MATCH LOGIN
  //   path: "/",          // MUST MATCH LOGIN
  // });

  return res.json({ message: "Logged out successfully" });
};
// auth.controller.js
exports.me = async (req, res) => {
  res.json(req.user);
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    // 🔒 Prevent user enumeration
    if (!user) {
      return res.json({
        message: "If the email exists, a reset code has been sent.",
      });
    }

    // ✅ Check for existing active OTP
    if (
      user.resetOtp &&
      user.resetOtpExpires &&
      user.resetOtpExpires > Date.now()
    ) {
      return res.json({
        message: "A reset code has already been sent. Please check your email.",
      });
    }

    // 🔢 Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // 🔐 Hash OTP
    const hashedOtp = await bcrypt.hash(otp, 10);

    // ⏱ Save OTP + expiry (10 minutes)
    user.resetOtp = hashedOtp;
    user.resetOtpExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    // 📧 Send premium email
    await sendEmail({
      to: user.email,
      subject: "Password Reset Verification Code",
      text: `
We received a request to reset the password for your Live Scan Billing account.

Your verification code is:
${otp}

This code will expire in 10 minutes.

If you did not request a password reset, no action is required and your account remains secure.
      `,
      html: `
<!DOCTYPE html>
<html>
  <body style="font-family: Arial, sans-serif; color: #333;">
    <p>Hello,</p>

    <p>
      We received a request to reset the password for your
      <strong>Live Scan Billing</strong> account.
    </p>

    <p>
      To continue, please enter the verification code below:
    </p>

    <div style="
      font-size: 24px;
      font-weight: bold;
      letter-spacing: 4px;
      margin: 18px 0;
    ">
      ${otp}
    </div>

    <p>
      This code will expire in <strong>10 minutes</strong>.
    </p>

    <p>
      If you did not request a password reset, no action is required.
      Your account remains secure.
    </p>

    <hr style="margin: 28px 0;" />

    <p style="font-size: 12px; color: #888;">
      Live Scan Billing<br />
      Secure Account Access
    </p>
  </body>
</html>
      `,
    });

    return res.json({
      message: "If the email exists, a reset code has been sent.",
    });
  } catch (err) {
    console.error("FORGOT PASSWORD ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Password too short" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !user.resetOtp || !user.resetOtpExpires) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (user.resetOtpExpires < Date.now()) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const isValidOtp = await bcrypt.compare(otp, user.resetOtp);
    if (!isValidOtp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Update password
    user.password = await bcrypt.hash(newPassword, 10);

    // Invalidate OTP
    user.resetOtp = undefined;
    user.resetOtpExpires = undefined;

    await user.save();
    // Send confirmation email
    await sendEmail({
  to: user.email,

  // 🔑 DIFFERENT SUBJECT (breaks threading)
  subject: "Security Confirmation: Password Updated",

  // 🔑 Plain text (short, different)
  text: `
This email confirms that your Live Scan Billing password has been updated.

If you did not make this change, please contact support immediately.
  `,

  // 🔑 HTML (structurally different from OTP email)
  html: `
<!DOCTYPE html>
<html>
  <body style="font-family: Arial, sans-serif; color: #333;">
    <p>Hello,</p>

    <p>
      This message confirms that the password for your
      <strong>Live Scan Billing</strong> account has been updated.
    </p>

    <div style="
      background-color: #f6f9fc;
      border: 1px solid #dce3ea;
      padding: 16px;
      margin: 20px 0;
      border-radius: 6px;
      font-weight: 600;
    ">
      Password update completed successfully
    </div>

    <p>
      If you made this change, no further action is required.
    </p>

    <p>
      If you did not perform this update, please contact your system
      administrator or support team immediately.
    </p>

    <hr style="margin: 28px 0;" />

    <p style="font-size: 12px; color: #888;">
      Live Scan Billing<br />
      Security Notification
    </p>
  </body>
</html>
  `,
});



    return res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error("RESET PASSWORD ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};


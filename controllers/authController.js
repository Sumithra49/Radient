const bcrypt = require("bcrypt");
const crypto = require("crypto");
const User = require("../models/User");
const Token = require("../models/Token");
const transporter = require("../config/mailer");
const { validationResult } = require("express-validator");

// Helper function to send emails
const sendEmail = async (email, subject, text) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: subject,
      text: text,
    });
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

// User Registration
exports.register = async (req, res) => {
  // Validate input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, email, password } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    user = new User({
      username,
      email,
      password: hashedPassword,
    });

    await user.save();

    res.status(201).json({ msg: "User registered successfully" });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

// User Login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // Initialize session
    req.session.userId = user.id;

    res.status(200).json({ msg: "Login successful" });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

// User Logout
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error during logout:", err);
      return res.status(500).json({ msg: "Server error" });
    }
    res.status(200).json({ msg: "Logout successful" });
  });
};

// Initiate Password Reset
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ msg: "User with this email does not exist" });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Save token to database
    const token = new Token({
      userId: user.id,
      token: hashedToken,
      expires: Date.now() + 3600000, // 1 hour
    });

    await token.save();

    // Send reset email
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    const message = `You requested a password reset. Please make a PUT request to: ${resetUrl}`;

    await sendEmail(user.email, "Password Reset", message);

    res.status(200).json({ msg: "Password reset email sent" });
  } catch (error) {
    console.error("Error during password reset initiation:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    // Hash the token
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Find token in database
    const passwordResetToken = await Token.findOne({
      token: hashedToken,
      expires: { $gt: Date.now() },
    });

    if (!passwordResetToken) {
      return res.status(400).json({ msg: "Invalid or expired token" });
    }

    // Find user
    const user = await User.findById(passwordResetToken.userId);
    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    // Delete token
    await passwordResetToken.deleteOne();

    res.status(200).json({ msg: "Password reset successful" });
  } catch (error) {
    console.error("Error during password reset:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

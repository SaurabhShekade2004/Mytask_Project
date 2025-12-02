const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

const sendValidationError = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }
};

exports.registerUser = async (req, res) => {
  try {
    const error = sendValidationError(req, res);
    if (error) return;

    const { name, email, password } = req.body;

    const [existing] = await pool.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (existing.length > 0) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    );

    return res.status(201).json({
      message: "Account created successfully",
    });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const error = sendValidationError(req, res);
    if (error) return;

    const { email, password } = req.body;

    const [user] = await pool.query(
      "SELECT id, name, email, password, designation FROM users WHERE email = ?",
      [email]
    );

    if (user.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const found = user[0];

    const isMatch = await bcrypt.compare(password, found.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    const token = jwt.sign(
      {
        id: found.id,
        email: found.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: found.id,
        name: found.name,
        email: found.email,
        designation: found.designation || "",
      },
    });
  } catch (err) {
    console.error("LOGIN ERROR →", err);
    return res.status(500).json({ message: "Login error", error: err.message });
  }
};

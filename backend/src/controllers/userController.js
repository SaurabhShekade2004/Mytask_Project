const pool = require("../config/db");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");

exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const [user] = await pool.query(
      "SELECT id, name, email, designation, created_at, updated_at FROM users WHERE id = ?",
      [userId]
    );

    if (user.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "Profile fetched successfully",
      profile: user[0],
    });
  } catch (err) {
    console.error("PROFILE ERROR →", err);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ message: errors.array()[0].msg });

    const userId = req.user.id;
    const { name, designation } = req.body;

    if (req.body.email) {
      return res
        .status(400)
        .json({ message: "Email cannot be updated once registered" });
    }

    await pool.query(
      "UPDATE users SET name = COALESCE(?, name), designation = COALESCE(?, designation), updated_at = NOW() WHERE id = ?",
      [name, designation, userId]
    );

    return res.status(200).json({
      message: "Profile updated successfully",
    });
  } catch (err) {
    console.error("UPDATE PROFILE ERROR →", err);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ message: errors.array()[0].msg });

    const userId = req.user.id;
    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const [user] = await pool.query(
      "SELECT password FROM users WHERE id = ?",
      [userId]
    );

    if (user.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const storedHash = user[0].password;

    const isMatch = await bcrypt.compare(oldPassword, storedHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Old password is incorrect" });
    }

    const hashedNewPass = await bcrypt.hash(newPassword, 10);

    await pool.query(
      "UPDATE users SET password = ?, updated_at = NOW() WHERE id = ?",
      [hashedNewPass, userId]
    );

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("CHANGE PASSWORD ERROR →", err);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

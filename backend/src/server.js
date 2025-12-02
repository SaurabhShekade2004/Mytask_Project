const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Test DB connection
const pool = require("./config/db");

(async () => {
  try {
    await pool.query("SELECT 1");
    console.log("🟢 MySQL Connected Successfully");
  } catch (err) {
    console.error("🔴 MySQL Connection Failed:", err);
  }
})();

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/tasks", require("./routes/taskRoutes"));

app.use((err, req, res, next) => {
  console.error("SERVER ERROR →", err);
  res
    .status(err.status || 500)
    .json({ message: err.message || "Internal Server Error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on PORT ${PORT}`));

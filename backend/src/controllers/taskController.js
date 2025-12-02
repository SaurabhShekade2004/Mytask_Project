const pool = require("../config/db");
const { validationResult } = require("express-validator");

exports.createTask = async (req, res) => {
  try {
    console.log("📌 RECEIVED TASK BODY:", req.body);

    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ message: errors.array()[0].msg });

    const userId = req.user.id;
    let { title, description, due_date, completed } = req.body;

    // Convert date format for SQL
    const formattedDate = new Date(due_date).toISOString().split("T")[0];

    // Validate due date
    const today = new Date().setHours(0, 0, 0, 0);
    const due = new Date(formattedDate).setHours(0, 0, 0, 0);

    if (due < today) {
      return res
        .status(400)
        .json({ message: "Due date must be today or future" });
    }

    await pool.query(
      `INSERT INTO tasks (user_id, title, description, due_date, status) 
       VALUES (?, ?, ?, ?, ?)`,
      [
        userId,
        title,
        description || "",
        formattedDate,
        completed ? "completed" : "pending",
      ]
    );

    return res.status(201).json({ message: "Task created successfully" });
  } catch (err) {
    console.error("CREATE TASK ERROR →", err);
    return res.status(500).json({ message: "Something went wrong" });
  }
};


exports.getTasks = async (req, res) => {
  try {
    const userId = req.user.id;

    const [tasks] = await pool.query(
      "SELECT * FROM tasks WHERE user_id = ? ORDER BY due_date ASC",
      [userId]
    );

    return res.status(200).json({ tasks });
  } catch (err) {
    console.error("GET TASKS ERROR →", err);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ message: errors.array()[0].msg });

    const userId = req.user.id;
    const taskId = req.params.id;

    const { title, description, due_date, status } = req.body;

    await pool.query(
      `UPDATE tasks 
       SET 
         title = COALESCE(?, title),
         description = COALESCE(?, description),
         due_date = COALESCE(?, due_date),
         status = COALESCE(?, status),
         updated_at = NOW()
       WHERE id = ? AND user_id = ?`,
      [title, description, due_date, status, taskId, userId]
    );

    return res.status(200).json({ message: "Task updated successfully" });
  } catch (err) {
    console.error("UPDATE TASK ERROR →", err);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const userId = req.user.id;
    const taskId = req.params.id;

    await pool.query("DELETE FROM tasks WHERE id = ? AND user_id = ?", [
      taskId,
      userId,
    ]);

    return res.status(200).json({ message: "Task deleted successfully" });
  } catch (err) {
    console.error("DELETE TASK ERROR →", err);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

exports.searchTask = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title } = req.query;

    const [tasks] = await pool.query(
      `SELECT * FROM tasks 
       WHERE user_id = ? 
       AND title LIKE ?`,
      [userId, `%${title}%`]
    );

    return res.status(200).json({ tasks });
  } catch (err) {
    console.error("SEARCH TASK ERROR →", err);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

exports.filterTasks = async (req, res) => {
  try {
    const userId = req.user.id;
    const type = req.params.type;

    let query = "";

    if (type === "pending") {
      query = "SELECT * FROM tasks WHERE user_id = ? AND status = 'pending'";
    } else if (type === "completed") {
      query = "SELECT * FROM tasks WHERE user_id = ? AND status = 'completed'";
    } else if (type === "overdue") {
      query = `SELECT * FROM tasks 
               WHERE user_id = ? 
               AND status = 'pending' 
               AND due_date < CURDATE()`;
    } else {
      return res.status(400).json({ message: "Invalid filter type" });
    }

    const [tasks] = await pool.query(query, [userId]);

    return res.status(200).json({ tasks });
  } catch (err) {
    console.error("FILTER TASK ERROR →", err);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

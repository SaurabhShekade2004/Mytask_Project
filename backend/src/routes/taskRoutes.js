const router = require("express").Router();
const { body } = require("express-validator");
const auth = require("../middleware/auth");
const taskController = require("../controllers/taskController");

router.post(
  "/create",
  auth,
  [
    body("title").notEmpty().withMessage("Title is required"),
    body("due_date").notEmpty().withMessage("Due date is required"),
  ],
  taskController.createTask
);

router.get("/all", auth, taskController.getTasks);

router.put(
  "/update/:id",
  auth,
  [
    body("title").optional().notEmpty().withMessage("Title cannot be empty"),
    body("due_date")
      .optional()
      .notEmpty()
      .withMessage("Due date cannot be empty"),
  ],
  taskController.updateTask
);

router.delete("/delete/:id", auth, taskController.deleteTask);

router.get("/search", auth, taskController.searchTask);

router.get("/filter/:type", auth, taskController.filterTasks);

module.exports = router;

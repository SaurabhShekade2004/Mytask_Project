import { deleteTask, updateTask } from "../api/taskApi";
import { toast } from "react-hot-toast";
import { useState } from "react";

const TaskCard = ({ task, onUpdate, onDelete, onEdit }) => {
  const [loading, setLoading] = useState(false);

  const isCompleted = task.status === "completed";
  const isOverdue =
    new Date(task.due_date) < new Date() && !isCompleted;

  const getDotColor = () => {
    if (isCompleted) return "bg-green-500";
    if (isOverdue) return "bg-red-500";
    return "bg-yellow-500";
  };

  const getStatusColor = () => {
    if (isCompleted) return "text-green-600";
    if (isOverdue) return "text-red-500";
    return "text-yellow-600";
  };
  const toggleCompleted = async () => {
    try {
      setLoading(true);

      await updateTask(task.id, {
        status: isCompleted ? "pending" : "completed",
      });

      toast.success(
        isCompleted ? "Marked as Pending" : "Marked as Completed"
      );

      onUpdate();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Update failed");
      console.log("Update error:", err);
    } finally {
      setLoading(false);
    }
  };
  const removeTask = async () => {
    if (!window.confirm("Delete this task?")) return;

    try {
      await deleteTask(task.id);
      toast.success("Task deleted");
      onDelete();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Delete failed");
      console.log("Delete error:", err);
    }
  };

  return (
    <div className="glass-card p-5 w-full sm:w-[320px] flex flex-col justify-between">
      <div>
        {!isCompleted && (
          <button
            onClick={onEdit}
            className="text-blue-500 hover:text-blue-700 text-sm mb-1"
          >
            ✏ Edit
          </button>
        )}

        <h3
  className="font-semibold text-lg mt-1 break-words whitespace-normal max-h-16 overflow-y-auto pr-1"
>
  {task.title}
</h3>

<p
  className="text-sm text-slate-600 dark:text-slate-300 mt-1 break-words whitespace-normal max-h-20 overflow-y-auto pr-1"
>
  {task.description}
</p>

      </div>

      <div className="flex justify-between items-center mt-4">
        <div className="text-xs flex items-center gap-2 font-medium">
          <span className={`w-3 h-3 rounded-full ${getDotColor()}`} />

          <span className={getStatusColor()}>
            {isCompleted
              ? "Completed"
              : isOverdue
              ? "Overdue"
              : "Pending"}
          </span>
        </div>

        <div className="text-xs text-slate-500 dark:text-slate-300">
          Due: {task.due_date?.split("T")[0]}
        </div>
      </div>

      <div className="flex gap-3 mt-5 text-sm">
        {!isCompleted && (
          <button
            onClick={toggleCompleted}
            disabled={loading}
            className="px-3 py-1 rounded-full bg-primary text-white"
          >
            Complete
          </button>
        )}

        <button
          className="px-3 py-1 rounded-full bg-red-500 text-white"
          onClick={removeTask}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskCard;

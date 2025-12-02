import { useState, useEffect } from "react";
import { createTask, updateTask } from "../api/taskApi";
import { toast } from "react-hot-toast";

const TaskModal = ({ open, onClose, onCreated, editData }) => {
  if (!open) return null;

  const [form, setForm] = useState({
    title: "",
    description: "",
    due_date: "",
    completed: false,
  });
  function formatDate(date) {
    if (!date) return "";
    return date.split("T")[0];
  }

  useEffect(() => {
    if (editData) {
      setForm({
        title: editData.title,
        description: editData.description,
        due_date: formatDate(editData.due_date),
        completed: editData.status === "completed",
      });
    } else {
      setForm({
        title: "",
        description: "",
        due_date: "",
        completed: false,
      });
    }
  }, [editData]);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const submit = async (e) => {
    e.preventDefault();

    try {
      if (editData) {
        // Edit Mode
        await updateTask(editData.id, {
          ...form,
          status: form.completed ? "completed" : "pending",
        });

        toast.success("Task updated");
      } else {
        // Create Mode
        await createTask({
          ...form,
          status: form.completed ? "completed" : "pending",
        });

        toast.success("Task created");
      }

      onCreated();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed!");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="glass-card w-full max-w-md p-6">
        <h2 className="text-xl font-semibold mb-4">
          {editData ? "Edit Task" : "Add New Task"}
        </h2>

        <form className="space-y-4" onSubmit={submit}>
          <input
            name="title"
            placeholder="Title"
            required
            value={form.title}
            className="w-full border rounded-xl px-3 py-2 text-sm bg-white/80 dark:bg-slate-800/80"
            onChange={handleChange}
          />

          <textarea
            name="description"
            placeholder="Description"
            required
            rows={3}
            value={form.description}
            className="w-full border rounded-xl px-3 py-2 text-sm bg-white/80 dark:bg-slate-800/80"
            onChange={handleChange}
          />

          <input
            name="due_date"
            type="date"
            required
            value={form.due_date}
            className="w-full border rounded-xl px-3 py-2 text-sm bg-white/80 dark:bg-slate-800/80"
            onChange={handleChange}
          />

          <label className="text-sm flex gap-2 items-center">
            <input
              type="checkbox"
              name="completed"
              checked={form.completed}
              onChange={handleChange}
            />
            Completed
          </label>

          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1 rounded-full bg-slate-200 dark:bg-slate-700"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-1 rounded-full bg-primary text-white"
            >
              {editData ? "Update Task" : "Add Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;

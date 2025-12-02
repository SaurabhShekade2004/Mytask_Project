import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import TaskCard from "../components/TaskCard";
import TaskModal from "../components/TaskModal";
import { getTasks, searchTasks } from "../api/taskApi";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [query, setQuery] = useState("");

  const fetchData = async () => {
    try {
      const res = await getTasks();
      setTasks(res.data.tasks || []);
    } catch (err) {
      console.log("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => {
      if (!query.trim()) fetchData(); // empty? load all
      else handleSearch(); // typed? search
    }, 400); // delay 400ms

    return () => clearTimeout(delay); // cleanup
  }, [query]);

  const handleSearch = async () => {
    try {
      const res = await searchTasks(query);
      setTasks(res.data.tasks || []);
    } catch (err) {
      console.log("Search error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900">
      <Navbar />

      <div className="px-6 py-6 max-w-6xl mx-auto">
        <div className="flex flex-wrap gap-3 mb-6 items-center ">
          <input
            type="text"
            placeholder="Search tasks..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="px-3 py-2 border **border-gray-700** rounded-lg bg-white/80 dark:bg-slate-800/80 text-sm"
          />

          <button
            onClick={() => setOpenModal(true)}
            className="ml-auto px-4 py-2 rounded-lg bg-purple-600 text-white"
          >
            + Add Task
          </button>
        </div>
        {tasks?.length === 0 ? (
          <p className="text-sm text-slate-500">No tasks found.</p>
        ) : (
          <div className="flex flex-wrap gap-6">
            {tasks.map((t) => (
              <TaskCard
                key={t.id}
                task={t}
                onUpdate={fetchData}
                onDelete={fetchData}
                onEdit={() => {
                  setEditTask(t);
                  setOpenModal(true);
                }}
              />
            ))}
          </div>
        )}
      </div>
      <TaskModal
        open={openModal || !!editTask}
        onClose={() => {
          setOpenModal(false);
          setEditTask(null);
        }}
        onCreated={fetchData}
        editData={editTask}
      />
    </div>
  );
};

export default Dashboard;

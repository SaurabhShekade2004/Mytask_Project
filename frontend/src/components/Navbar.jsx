import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <header className="w-full px-6 py-4 flex items-center justify-between bg-white/60 dark:bg-slate-900/70 backdrop-blur-md border-b border-white/40 dark:border-slate-800 sticky top-0 z-20">
      
      {/* Logo */}
      <div className="flex gap-2 items-center cursor-pointer" onClick={() => navigate("/")}>
        <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-white font-bold">
          {user?.name?.[0]?.toUpperCase() || "U"}
        </div>
        <h1 className="font-semibold tracking-tight">MyTasks</h1>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={toggleTheme}
          className="px-3 py-1 rounded-full border text-xs border-slate-300 dark:border-slate-700"
        >
          {theme === "light" ? "Dark Mode" : "Light Mode"}
        </button>

        {/* Profile */}
        <button
          onClick={() => navigate("/profile")}
          className="flex gap-2 items-center px-3 py-1 rounded-full bg-white/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-400 to-blue-600 flex items-center justify-center text-white font-semibold">
            {user?.name?.[0]?.toUpperCase() || "U"}
          </div>
        </button>

        {/* Logout */}
        <button
          onClick={logout}
          className="text-xs px-3 py-1 rounded-full bg-red-500 text-white"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword)
      return alert("Passwords do not match");

    const res = await signup({
      name: form.name,
      email: form.email,
      password: form.password,
    });

    if (res.ok) navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-200 dark:bg-slate-900">
      <div className="glass-card px-8 py-10 w-full max-w-md">
        <h1 className="text-2xl font-semibold text-center mb-6">
          Create Account
        </h1>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            name="name"
            placeholder="Full Name"
            required
            value={form.name}
            onChange={handleChange}
            className="w-full rounded-xl px-3 py-2 border text-sm bg-white/80 dark:bg-slate-800/80"
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            value={form.email}
            onChange={handleChange}
            className="w-full rounded-xl px-3 py-2 border text-sm bg-white/80 dark:bg-slate-800/80"
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            required
            value={form.password}
            onChange={handleChange}
            className="w-full rounded-xl px-3 py-2 border text-sm bg-white/80 dark:bg-slate-800/80"
          />

          <input
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            required
            value={form.confirmPassword}
            onChange={handleChange}
            className="w-full rounded-xl px-3 py-2 border text-sm bg-white/80 dark:bg-slate-800/80"
          />

          <button className="w-full py-2 rounded-full bg-primary text-white">
            Create Account
          </button>
        </form>

        <p className="text-xs text-center mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-primary font-medium">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;

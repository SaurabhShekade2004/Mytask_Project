import { createContext, useContext, useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import { toast } from "react-hot-toast";

// Create Context
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  // Load user if token exists
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }

    setLoading(false);
  }, [token]);

  // Login
  const login = async (email, password) => {
    try {
      const res = await axiosClient.post("/auth/login", { email, password });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      setToken(res.data.token);
      setUser(res.data.user);

      toast.success("Login successful");
      return { ok: true };
    } catch (err) {
      toast.error(err?.response?.data?.message || "Login failed");
      return { ok: false };
    }
  };

  // Signup
  const signup = async (payload) => {
    try {
      const res = await axiosClient.post("/auth/signup", payload);
      toast.success(res.data.message);
      return { ok: true };
    } catch (err) {
      toast.error(err?.response?.data?.message || "Signup failed");
      return { ok: false };
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
    toast.success("Logout successful");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        signup,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook
export const useAuth = () => useContext(AuthContext);

export default AuthContext;

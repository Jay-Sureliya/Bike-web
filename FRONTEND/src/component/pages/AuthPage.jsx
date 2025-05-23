import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { FiMail, FiLock, FiUser } from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const InputField = ({ type, placeholder, icon: Icon, value, onChange }) => (
  <div className="relative">
    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
      <Icon />
    </span>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required
      autoComplete="off"
      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 transition"
    />
  </div>
);

const AuthPage = () => {
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("isLoggedIn") === "true");
  const [userEmail, setUserEmail] = useState(localStorage.getItem("userEmail") || null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const checkLoginStatus = async () => {
      // Skip API call if already logged in and email is set
      if (isLoggedIn && userEmail) return;

      try {
        const res = await axios.get("http://localhost:3000/me", { withCredentials: true });
        if (res.data.loggedIn) {
          setIsLoggedIn(true);
          const email = res.data.user.email || res.data.user.username || null;
          setUserEmail(email);
          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("userEmail", email || "");
        } else {
          setIsLoggedIn(false);
          setUserEmail(null);
          localStorage.removeItem("isLoggedIn");
          localStorage.removeItem("userEmail");
        }
      } catch (err) {
        console.error("Error fetching /me:", err.response?.data || err.message);
        // Fallback to localStorage only if API fails
        const storedLoggedIn = localStorage.getItem("isLoggedIn") === "true";
        setIsLoggedIn(storedLoggedIn);
        setUserEmail(storedLoggedIn ? localStorage.getItem("userEmail") || null : null);
        if (!storedLoggedIn) {
          toast.error("Failed to verify login status. Please try logging in again.");
        }
      }
    };
    checkLoginStatus();
  }, [location.pathname, isLoggedIn, userEmail]);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:3000/register",
        { name, email, password },
        { withCredentials: true }
      );
      toast.success("Registered successfully! You can now log in.");
      setIsLogin(true);
      setName("");
      setEmail("");
      setPassword("");
    } catch (err) {
      toast.error(err.response?.data?.error || "Registration failed");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:3000/login",
        { email, password },
        { withCredentials: true }
      );
      toast.success("Login successful!");
      setIsLoggedIn(true);
      setUserEmail(email);
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userEmail", email);
      setName("");
      setEmail("");
      setPassword("");
    } catch (err) {
      toast.error(err.response?.data?.error || "Login failed");
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:3000/logout", {}, { withCredentials: true });
      toast.info("Logged out successfully!");
      setIsLoggedIn(false);
      setIsLogin(true);
      setUserEmail(null);
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("userEmail");
      setName("");
      setEmail("");
      setPassword("");
    } catch (err) {
      toast.error("Logout failed. Please try again.");
    }
  };

  if (isLoggedIn) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
        <ToastContainer />
        <div className="bg-white shadow-xl rounded-xl w-full max-w-md p-8 space-y-6 text-center">
          <h2 className="text-2xl font-semibold">
            Welcome back{userEmail ? `, ${userEmail}` : ""}!
          </h2>
          <button
            onClick={handleLogout}
            className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 rounded-lg transition"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-xl rounded-xl w-full max-w-md p-8 space-y-6">
        <ToastContainer />
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => setIsLogin(true)}
            className={`px-5 py-2 font-medium rounded-lg transition ${
              isLogin ? "bg-red-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-red-100"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`px-5 py-2 font-medium rounded-lg transition ${
              !isLogin ? "bg-red-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-red-100"
            }`}
          >
            Register
          </button>
        </div>

        <form onSubmit={isLogin ? handleLogin : handleRegister} className="space-y-5">
          {!isLogin && (
            <InputField
              type="text"
              placeholder="Full Name"
              icon={FiUser}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}
          <InputField
            type="email"
            placeholder="Email Address"
            icon={FiMail}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <InputField
            type="password"
            placeholder="Password"
            icon={FiLock}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 rounded-lg transition"
          >
            {isLogin ? "Login" : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;
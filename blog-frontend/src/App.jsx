import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import VerifyEmail from "./pages/VerifyEmail";
import CreateBlog from "./pages/CreateBlog";
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Profile from './pages/Profile';
import YourBlogs from './pages/YourBlogs';
import BlogDetail from './pages/BlogDetail';

function App() {
  // ✅ Initialize state with localStorage data
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const location = useLocation();

  // ✅ Sync user state from localStorage on app load
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    }
  }, []);

  // ✅ Update user state when profile is updated
  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // ✅ Handle logout and state reset
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/login"; // ✅ Force reload after logout
  };

  // ✅ Hide Navbar on specific routes
  const hideNavbar =
    location.pathname === "/login" || location.pathname.startsWith("/verify-email");

  return (
    <>
      <ToastContainer position="top-center" autoClose={3000} />

      {!hideNavbar && <Navbar user={user} setUser={updateUser} onLogout={handleLogout} />}

      {/* ✅ Pass `user` state to Home */}
      <Routes>
        <Route path="/" element={<Home user={user} />} />
        <Route path="/login" element={<Login setUser={updateUser} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create-blog" element={<CreateBlog />} />
        <Route path="/verify-email/:uid/:token" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:uid/:token" element={<ResetPassword />} />
        <Route path="/profile" element={<Profile user={user} setUser={updateUser} />} />
        <Route path="/yourblog" element={<YourBlogs/>}/>
        <Route path="/blogs/:id" element={<BlogDetail />} />
        
      </Routes>
    </>
  );
}

export default App;



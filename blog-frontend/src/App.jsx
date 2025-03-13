
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

function App() {
  // ✅ Initialize user state with full user data from localStorage
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      return {
        id: parsedUser?.id || null, // ✅ Ensure id is properly stored
        username: parsedUser?.username || "",
        email: parsedUser?.email || "",
        phone: parsedUser?.phone || "",
        first_name: parsedUser?.first_name || "",
        last_name: parsedUser?.last_name || "",
        profile_picture: parsedUser?.profile_picture || null, // ✅ Handle missing profile picture
      };
    }
    return null;
  });

  const location = useLocation();

  // ✅ Sync user data from localStorage on app load
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser({
        id: parsedUser?.id || null,
        username: parsedUser?.username || "",
        email: parsedUser?.email || "",
        phone: parsedUser?.phone || "",
        first_name: parsedUser?.first_name || "",
        last_name: parsedUser?.last_name || "",
        profile_picture: parsedUser?.profile_picture || null,
      });
    }
  }, []);

  // ✅ Hide Navbar on specific routes
  const hideNavbar =
    location.pathname === "/login" || location.pathname.startsWith("/verify-email");

  // ✅ Handle user update to persist profile picture and user ID
  const updateUser = (userData) => {
    setUser(userData);

    // ✅ Save full user data to localStorage
    localStorage.setItem("user", JSON.stringify(userData));

    // ✅ Persist profile picture separately for quick access
    if (userData?.profile_picture) {
      localStorage.setItem("profile_picture", userData.profile_picture);
    }
  };


const handleLogout = () => {
  // ✅ Clear localStorage completely
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
  localStorage.removeItem("profile_picture");

  // ✅ Force state update and rerender
  setUser(null);

  // ✅ Optional: Force rerender by navigating to login page
  window.location.href = "/login";
};

  return (
    <>
      {/* ✅ Toast Container */}
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
        theme="light"
      />

      {/* ✅ Conditionally render Navbar */}
      {!hideNavbar && (
        <Navbar
          user={user}
          setUser={updateUser}
          onLogout={handleLogout}
        />
      )}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setUser={updateUser} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create-blog" element={<CreateBlog />} />
        <Route path="/verify-email/:uid/:token" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:uid/:token" element={<ResetPassword />} />
        <Route path="/profile" element={<Profile user={user} setUser={updateUser} />} />
      </Routes>
    </>
  );
}

export default App;

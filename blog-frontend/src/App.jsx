// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { useState, useEffect } from "react";
// import { Routes, Route, useLocation } from "react-router-dom";
// import Navbar from "./components/Navbar";
// import Home from "./pages/Home";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import Dashboard from "./pages/Dashboard";
// import VerifyEmail from "./pages/VerifyEmail";
// import CreateBlog from "./pages/CreateBlog";
// import ForgotPassword from './pages/ForgotPassword';
// import ResetPassword from './pages/ResetPassword';
// import Profile from './pages/Profile';
// import YourBlogs from './pages/YourBlogs';
// import BlogDetail from './pages/BlogDetail';
// import EditBlog from './pages/EditBlog';

// function App() {
//   //  Initialize state with localStorage data
//   const [user, setUser] = useState(() => {
//     const storedUser = localStorage.getItem("user");
//     return storedUser ? JSON.parse(storedUser) : null;
//   });

//   const location = useLocation();

//   //  Sync user state from localStorage on app load
//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) {
//       const parsedUser = JSON.parse(storedUser);
//       setUser(parsedUser);
//     }
//   }, []);

//   //  Update user state when profile is updated
//   const updateUser = (userData) => {
//     setUser(userData);
//     localStorage.setItem("user", JSON.stringify(userData));
//   };

//   // Handle logout and state reset
//   const handleLogout = () => {
//     localStorage.removeItem("accessToken");
//     localStorage.removeItem("refreshToken");
//     localStorage.removeItem("user");
//     setUser(null);
//     window.location.href = "/login"; // Force reload after logout
//   };

//   //  Hide Navbar on specific routes
//   const hideNavbar =
//     location.pathname === "/login" ||
//     location.pathname.startsWith("/verify-email") ||
//     location.pathname === "/forgot-password" ||
//     location.pathname.includes("/reset-password");

//   return (
//     <>
//       <ToastContainer position="top-center" autoClose={3000} />

//       {!hideNavbar && <Navbar user={user} setUser={updateUser} onLogout={handleLogout} />}

//       <Routes>
//         <Route path="/" element={<Home user={user} />} />
//         <Route path="/login" element={<Login setUser={updateUser} />} />
//         <Route path="/register" element={<Register />} />
//         <Route path="/dashboard" element={<Dashboard />} />
//         <Route path="/create-blog" element={<CreateBlog />} />
//         <Route path="/verify-email/:uid/:token" element={<VerifyEmail />} />
//         <Route path="/forgot-password" element={<ForgotPassword />} />
//         <Route path="/reset-password/:uid/:token" element={<ResetPassword />} />
//         <Route path="/profile" element={<Profile user={user} setUser={updateUser} />} />
//         <Route path="/yourblog" element={<YourBlogs/>}/>
//         <Route path="/blogs/:id" element={<BlogDetail />} />
//         <Route path="/blogs/edit/:id" element={<EditBlog />} />
//       </Routes>
//     </>
//   );
// }

// export default App;
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer"; // Import Footer
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
import EditBlog from './pages/EditBlog';

function App() {
  //  Initialize state with localStorage data
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const location = useLocation();

  //  Sync user state from localStorage on app load
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    }
  }, []);

  //  Update user state when profile is updated
  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // Handle logout and state reset
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/login"; // Force reload after logout
  };

  //  Hide Navbar and Footer on specific routes
  const hideNavbarFooter =
    location.pathname === "/login" ||
    location.pathname.startsWith("/verify-email") ||
    location.pathname === "/forgot-password" ||
    location.pathname.includes("/reset-password");

  return (
    <div className="flex flex-col min-h-screen">
      <ToastContainer position="top-center" autoClose={3000} />

      {!hideNavbarFooter && <Navbar user={user} setUser={updateUser} onLogout={handleLogout} />}

      <div className="flex-grow">
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
          <Route path="/blogs/edit/:id" element={<EditBlog />} />
        </Routes>
      </div>

      {!hideNavbarFooter && <Footer />} {/* Conditionally render Footer */}
    </div>
  );
}

export default App;

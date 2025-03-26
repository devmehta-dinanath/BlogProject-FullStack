import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import profile from "../assets/profile.jpeg";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const Navbar = ({ user, setUser }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileImage, setProfileImage] = useState(profile);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser && JSON.stringify(storedUser) !== JSON.stringify(user)) {
      setUser(storedUser);
      if (storedUser.profile_picture) {
        setProfileImage(`${BASE_URL}${storedUser.profile_picture}`);
      }
    }

    const handleStorageChange = () => {
      const updatedUser = JSON.parse(localStorage.getItem("user"));
      if (JSON.stringify(updatedUser) !== JSON.stringify(user)) {
        setUser(updatedUser);
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [user, setUser]);

  useEffect(() => {
    if (user?.profile_picture) {
      setProfileImage(`${BASE_URL}${user.profile_picture}`);
    } else {
      setProfileImage(profile);
    }
  }, [user?.profile_picture]);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    localStorage.removeItem("authorId");
    localStorage.removeItem("profile_picture");

    setUser(null);
    setProfileImage(profile);
  };

  return (
    <>
      {/* Fixed Navbar */}
      <nav className="bg-[#1E3A8A] text-white shadow-md fixed top-0 left-0 w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-2">
              <img 
                src={logo} 
                alt="Logo"
                className="h-10 w-10 rounded-full object-cover"
              />
              <Link to="/" className="font-bold text-lg">MyBlog</Link>
            </div>

            <div className="hidden md:flex space-x-6">
              <Link to="/" className="hover:text-gray-300">Home</Link>
              <Link to="/dashboard" className="hover:text-gray-300">Blog</Link>
              {user && (
                <>
                  <Link to="/yourblog" className="hover:text-gray-300">Your Blogs</Link>
                  <Link to="/create-blog" className="hover:text-gray-300">Create Blog</Link>
                </>
              )}
            </div>

            {user ? (
              <div className="relative ml-4">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center focus:outline-none"
                >
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="h-10 w-10 rounded-full object-cover border-2 border-white"
                    onError={() => setProfileImage(profile)}
                  />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white shadow-lg rounded-lg overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-800">{user.username}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <Link to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition">View Profile</Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100 transition"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex space-x-4">
                <Link to="/login" className="bg-gray-800 px-4 py-2 rounded hover:bg-gray-700">Login</Link>
                <Link to="/register" className="bg-green-500 px-4 py-2 rounded hover:bg-green-700">Register</Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden focus:outline-none text-2xl"
            >
              {isOpen ? "✖" : "☰"}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-[#1E3A8A] p-4 space-y-3">
            <Link to="/" className="block hover:text-gray-300">Home</Link>
            <Link to="/dashboard" className="block hover:text-gray-300">Blogs</Link>
            {user ? (
              <>
                <Link to="/yourblog" className="block hover:text-gray-300">Your Blogs</Link>
                <Link to="/create-blog" className="block hover:text-gray-300">Create Blog</Link>
                <Link to="/profile" className="block hover:text-gray-300">View Profile</Link>
                <button onClick={handleLogout} className="w-full bg-red-500 px-4 py-2 rounded hover:bg-red-700">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="block bg-gray-800 px-4 py-2 rounded hover:bg-gray-700">Login</Link>
                <Link to="/register" className="block bg-green-500 px-4 py-2 rounded hover:bg-green-700">Register</Link>
              </>
            )}
          </div>
        )}
      </nav>

      {/* To prevent content from being hidden behind the navbar */}
      <div className="h-16"></div>
    </>
  );
};

export default Navbar;

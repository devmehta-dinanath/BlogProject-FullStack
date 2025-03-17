// import { useEffect, useState } from 'react';
// import { FiEye, FiEdit, FiTrash, FiMessageCircle } from "react-icons/fi";
// import { useNavigate } from 'react-router-dom';

// const Dashboard = () => {
//   const [blogs, setBlogs] = useState([]);
//   const [error, setError] = useState('');
//   const navigate = useNavigate(); // ✅ Initialize navigate

//   const fetchBlogs = async (token) => {
//     try {
//       const response = await fetch("http://127.0.0.1:8000/api/blogs/", {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: token ? `Bearer ${token}` : "",
//         },
//       });

//       if (response.status === 401) {
//         console.log("Access token expired. Attempting to refresh...");
//         const refreshed = await refreshAccessToken();
//         if (refreshed) {
//           await fetchBlogs(refreshed);
//           return;
//         } else {
//           throw new Error("Session expired. Please log in again.");
//         }
//       }

//       if (!response.ok) {
//         throw new Error("Failed to fetch blogs");
//       }

//       const data = await response.json();
//       setBlogs(data);
//     } catch (err) {
//       console.error(err);
//       setError(err.message || "Failed to load blogs");
//     }
//   };

//   const refreshAccessToken = async () => {
//     try {
//       const refreshToken = localStorage.getItem("refreshToken");
//       if (!refreshToken) return null;

//       const response = await fetch("http://127.0.0.1:8000/api/auth/token/refresh/", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ refresh: refreshToken }),
//       });

//       if (!response.ok) throw new Error("Failed to refresh token");

//       const data = await response.json();
//       localStorage.setItem("accessToken", data.access);
//       console.log("Token refreshed successfully");
//       return data.access;
//     } catch (err) {
//       console.error("Failed to refresh token:", err);
//       handleLogout();
//       return null;
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("accessToken");
//     localStorage.removeItem("refreshToken");
//     localStorage.removeItem("user");
//     localStorage.removeItem("authorId");
//     localStorage.removeItem("profile_picture");
//     navigate("/login"); // ✅ Redirect using navigate
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm("Are you sure you want to delete this blog?")) {
//       try {
//         const token = localStorage.getItem("accessToken");
//         const response = await fetch(`http://127.0.0.1:8000/api/blogs/${id}/`, {
//           method: "DELETE",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: token ? `Bearer ${token}` : "",
//           },
//         });

//         if (!response.ok) throw new Error("Failed to delete blog");

//         setBlogs(blogs.filter((blog) => blog.id !== id));
//         alert("Blog deleted successfully");
//       } catch (error) {
//         console.error(error);
//         alert("Failed to delete blog");
//       }
//     }
//   };

//   useEffect(() => {
//     const token = localStorage.getItem("accessToken");
//     if (token) {
//       fetchBlogs(token);
//     } else {
//       setError("You need to log in to view blogs");
//     }
//   }, []);

//   return (
//     <div className="max-w-7xl mx-auto mt-10 p-6 bg-gray-50 shadow-lg rounded-xl">
//       <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">
//         📚 All Blogs
//       </h2>

//       {error && (
//         <p className="text-red-500 text-center mb-4 bg-red-100 p-2 rounded-lg">
//           {error}
//         </p>
//       )}

//       {blogs.length === 0 ? (
//         <p className="text-center text-gray-500">No blogs found.</p>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//           {blogs.map((blog) => (
//             <div
//               key={blog.id}
//               className="group bg-white border border-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300 relative"
//             >
//               {/* ✅ Blog Image */}
//               {blog.image && (
//                 <div className="w-full h-52">
//                   <img
//                     src={`http://127.0.0.1:8000${blog.image}`} // ✅ Ensure full URL
//                     alt={blog.title}
//                     className="w-full h-full object-cover"
//                     onError={(e) => {
//                       console.error("Image failed to load:", e);
//                       e.target.src = "https://via.placeholder.com/300"; // ✅ Fallback image
//                     }}
//                   />
//                 </div>
//               )}

//               {/* ✅ Hover with Transparent Blur Background */}
//               <div className="absolute inset-0 bg-white bg-opacity-40 backdrop-blur-md opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center space-x-4">
//                 {/* ✅ Eye Icon */}
//                 <FiEye
//                   className="text-gray-700 text-2xl cursor-pointer hover:text-blue-500 transition"
//                   onClick={() => navigate(`/blogs/${blog.id}`)} // ✅ Fix here
//                 />

//                 {/* ✅ Edit Icon */}
//                 <FiEdit
//                   className="text-gray-700 text-2xl cursor-pointer hover:text-green-500 transition"
//                   onClick={() => navigate(`/blogs/edit/${blog.id}`)} // ✅ Fix here
//                 />

//                 {/* ✅ Delete Icon */}
//                 <FiTrash
//                   className="text-gray-700 text-2xl cursor-pointer hover:text-red-500 transition"
//                   onClick={() => handleDelete(blog.id)}
//                 />

//                 {/* ✅ Comment Icon */}
//                 <FiMessageCircle
//                   className="text-gray-700 text-2xl cursor-pointer hover:text-yellow-500 transition"
//                   onClick={() => navigate(`/blogs/${blog.id}/comments`)} // ✅ Fix here
//                 />
//               </div>

//               {/* ✅ Blog Content */}
//               <div className="p-4">
//                 <h3 className="text-xl font-semibold text-gray-800">
//                   {blog.title}
//                 </h3>
//                 <p className="text-gray-600 mt-2 line-clamp-3">
//                   {blog.content}
//                 </p>

//                 {/* ✅ Footer */}
//                 <div className="flex justify-between items-center text-sm text-gray-500 mt-4">
//                   <span>✍️ {blog.author}</span>
//                   <span>
//                     {new Date(blog.created_at).toLocaleString("en-US", {
//                       year: "numeric",
//                       month: "long",
//                       day: "numeric",
//                       hour: "2-digit",
//                       minute: "2-digit",
//                     })}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Dashboard;
import { useEffect, useState } from 'react';
import { FiEye, FiEdit, FiTrash, FiMessageCircle } from "react-icons/fi";
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [blogs, setBlogs] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // ✅ Fetch Blogs (Use token only if available)
  const fetchBlogs = async () => {
    try {
      const token = localStorage.getItem("accessToken");

      const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}), // ✅ Only add token if logged in
      };

      const response = await fetch("http://127.0.0.1:8000/api/blogs/", {
        method: "GET",
        headers,
      });

      if (!response.ok) {
        if (response.status === 401 && token) {
          console.log("Access token expired. Attempting to refresh...");
          const refreshed = await refreshAccessToken();
          if (refreshed) {
            await fetchBlogs(); // ✅ Retry after refreshing token
          } else {
            throw new Error("Session expired. Please log in again.");
          }
        } else {
          throw new Error("Failed to fetch blogs");
        }
      }

      const data = await response.json();
      setBlogs(data);
    } catch (err) {
      console.error("Error fetching blogs:", err);
      setError(err.message || "Failed to load blogs");
    }
  };

  // ✅ Refresh Access Token
  const refreshAccessToken = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) return null;

      const response = await fetch("http://127.0.0.1:8000/api/auth/token/refresh/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (!response.ok) throw new Error("Failed to refresh token");

      const data = await response.json();
      localStorage.setItem("accessToken", data.access);
      console.log("Token refreshed successfully");
      return data.access;
    } catch (err) {
      console.error("Failed to refresh token:", err);
      handleLogout(); // ✅ Logout if token refresh fails
      return null;
    }
  };

  // ✅ Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    localStorage.removeItem("authorId");
    localStorage.removeItem("profile_picture");
    navigate("/login");
  };

  // ✅ Delete Blog
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) throw new Error("You need to log in to delete a blog");

        const response = await fetch(`http://127.0.0.1:8000/api/blogs/${id}/`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to delete blog");

        setBlogs(blogs.filter((blog) => blog.id !== id));
        alert("Blog deleted successfully");
      } catch (error) {
        console.error("Failed to delete blog:", error);
        alert("Failed to delete blog");
      }
    }
  };

  // ✅ Fetch Blogs on Component Mount
  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <div className="max-w-7xl mx-auto mt-10 p-6 bg-gray-50 shadow-lg rounded-xl">
      {/* ✅ Heading */}
      <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">
        📚 All Blogs
      </h2>

      {/* ✅ Error Message */}
      {error && (
        <p className="text-red-500 text-center mb-4 bg-red-100 p-2 rounded-lg">
          {error}
        </p>
      )}

      {/* ✅ Blog List */}
      {blogs.length === 0 ? (
        <p className="text-center text-gray-500">No blogs found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <div
              key={blog.id}
              className="group bg-white border border-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300"
            >
              {/* ✅ Blog Image */}
              {blog.image && (
                <div className="w-full h-52">
                  <img
                    src={`http://127.0.0.1:8000${blog.image}`}
                    alt={blog.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* ✅ Blog Content */}
              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-800">
                  {blog.title}
                </h3>
                <p className="text-gray-600 mt-2 line-clamp-3">
                  {blog.content}
                </p>
                <div className="flex justify-between items-center text-sm text-gray-500 mt-4">
                  <span>✍️ {blog.author}</span>
                  <span>
                    {new Date(blog.created_at).toLocaleString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;




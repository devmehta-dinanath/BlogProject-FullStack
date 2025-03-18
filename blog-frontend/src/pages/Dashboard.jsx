
// // // import { useEffect, useState } from 'react';
// // // import { FiEye, FiEdit, FiTrash, FiMessageCircle } from "react-icons/fi";
// // // import { useNavigate } from 'react-router-dom';

// // // const Dashboard = () => {
// // //   const [blogs, setBlogs] = useState([]);
// // //   const [error, setError] = useState('');
// // //   const navigate = useNavigate();

// // //   // ✅ Fetch Blogs
// // //   const fetchBlogs = async () => {
// // //     try {
// // //       const token = localStorage.getItem("accessToken");

// // //       const headers = {
// // //         "Content-Type": "application/json",
// // //         ...(token ? { Authorization: `Bearer ${token}` } : {}),
// // //       };

// // //       const response = await fetch("http://127.0.0.1:8000/api/blogs/", {
// // //         method: "GET",
// // //         headers,
// // //       });

// // //       if (!response.ok) {
// // //         if (response.status === 401 && token) {
// // //           console.log("Access token expired. Attempting to refresh...");
// // //           const refreshed = await refreshAccessToken();
// // //           if (refreshed) {
// // //             await fetchBlogs(); 
// // //           } else {
// // //             throw new Error("Session expired. Please log in again.");
// // //           }
// // //         } else {
// // //           throw new Error("Failed to fetch blogs");
// // //         }
// // //       }

// // //       const data = await response.json();
// // //       setBlogs(data);
// // //     } catch (err) {
// // //       console.error("Error fetching blogs:", err);
// // //       setError(err.message || "Failed to load blogs");
// // //     }
// // //   };

// // //   // ✅ Refresh Access Token
// // //   const refreshAccessToken = async () => {
// // //     try {
// // //       const refreshToken = localStorage.getItem("refreshToken");
// // //       if (!refreshToken) return null;

// // //       const response = await fetch("http://127.0.0.1:8000/api/auth/token/refresh/", {
// // //         method: "POST",
// // //         headers: {
// // //           "Content-Type": "application/json",
// // //         },
// // //         body: JSON.stringify({ refresh: refreshToken }),
// // //       });

// // //       if (!response.ok) throw new Error("Failed to refresh token");

// // //       const data = await response.json();
// // //       localStorage.setItem("accessToken", data.access);
// // //       console.log("Token refreshed successfully");
// // //       return data.access;
// // //     } catch (err) {
// // //       console.error("Failed to refresh token:", err);
// // //       handleLogout(); 
// // //       return null;
// // //     }
// // //   };

// // //   // ✅ Handle Logout
// // //   const handleLogout = () => {
// // //     localStorage.removeItem("accessToken");
// // //     localStorage.removeItem("refreshToken");
// // //     localStorage.removeItem("user");
// // //     localStorage.removeItem("authorId");
// // //     localStorage.removeItem("profile_picture");
// // //     navigate("/login");
// // //   };

// // //   // ✅ Delete Blog
// // //   const handleDelete = async (id) => {
// // //     if (window.confirm("Are you sure you want to delete this blog?")) {
// // //       try {
// // //         const token = localStorage.getItem("accessToken");
// // //         const response = await fetch(`http://127.0.0.1:8000/api/blogs/${id}/delete/`, {
// // //           method: "DELETE",
// // //           headers: {
// // //             "Content-Type": "application/json",
// // //             Authorization: `Bearer ${token}`,
// // //           },
// // //         });

// // //         if (!response.ok) throw new Error("Failed to delete blog");

// // //         setBlogs(blogs.filter((blog) => blog.id !== id));
// // //         alert("Blog deleted successfully");
// // //       } catch (error) {
// // //         console.error(error);
// // //         alert("Failed to delete blog");
// // //       }
// // //     }
// // //   };

// // //   // ✅ Fetch Blogs on Component Mount
// // //   useEffect(() => {
// // //     fetchBlogs();
// // //   }, []);

// // //   return (
// // //     <div className="max-w-7xl mx-auto mt-10 p-6 bg-gray-50 shadow-lg rounded-xl">
// // //       {/* ✅ Heading */}
// // //       <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">
// // //         📚 All Blogs
// // //       </h2>

// // //       {/* ✅ Error Message */}
// // //       {error && (
// // //         <p className="text-red-500 text-center mb-4 bg-red-100 p-2 rounded-lg">
// // //           {error}
// // //         </p>
// // //       )}

// // //       {/* ✅ Blog List */}
// // //       {blogs.length === 0 ? (
// // //         <p className="text-center text-gray-500">No blogs found.</p>
// // //       ) : (
// // //         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
// // //           {blogs.map((blog) => (
// // //             <div
// // //               key={blog.id}
// // //               className="group bg-white border border-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-xl hover:scale-[1.02] transition duration-300 ease-in-out relative"
// // //             >
// // //               {/* ✅ Blog Image */}
// // //               {blog.image && (
// // //                 <div className="w-full h-52">
// // //                   <img
// // //                     src={blog.image}
// // //                     alt={blog.title}
// // //                     className="w-full h-full object-cover"
// // //                   />
// // //                 </div>
// // //               )}

// // //               {/* ✅ Hover Overlay */}
// // //               <div className="absolute inset-0 bg-white bg-opacity-40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center space-x-4">
// // //                 {/* ✅ Eye Icon */}
// // //                 <FiEye
// // //                   className="text-gray-700 text-3xl cursor-pointer hover:text-blue-500 transition transform hover:scale-110"
// // //                   onClick={() => navigate(`/blogs/${blog.id}`)}
// // //                 />

// // //                 {/* ✅ Edit Icon */}
// // //                 <FiEdit
// // //                   className="text-gray-700 text-3xl cursor-pointer hover:text-green-500 transition transform hover:scale-110"
// // //                   onClick={() => navigate(`/blogs/edit/${blog.id}`)}
// // //                 />

// // //                 {/* ✅ Delete Icon */}
// // //                 <FiTrash
// // //                   className="text-gray-700 text-3xl cursor-pointer hover:text-red-500 transition transform hover:scale-110"
// // //                   onClick={() => handleDelete(blog.id)}
// // //                 />

// // //               </div>

// // //               {/* ✅ Blog Content */}
// // //               <div className="p-4">
// // //                 <h3 className="text-xl font-semibold text-gray-800">
// // //                   {blog.title}
// // //                 </h3>
// // //                 <p className="text-gray-600 mt-2 line-clamp-3">
// // //                   {blog.content}
// // //                 </p>
// // //                 <div className="flex justify-between items-center text-sm text-gray-500 mt-4">
// // //                   <span>✍️ {blog.author}</span>
// // //                   <span>
// // //                     {new Date(blog.created_at).toLocaleString("en-US", {
// // //                       year: "numeric",
// // //                       month: "long",
// // //                       day: "numeric",
// // //                       hour: "2-digit",
// // //                       minute: "2-digit",
// // //                     })}
// // //                   </span>
// // //                 </div>
// // //               </div>
// // //             </div>
// // //           ))}
// // //         </div>
// // //       )}
// // //     </div>
// // //   );
// // // };

// // // export default Dashboard;

// import { useEffect, useState } from 'react';
// import { FiEye, FiEdit, FiTrash, FiMessageCircle } from "react-icons/fi";
// import { useNavigate } from 'react-router-dom';

// const Dashboard = () => {
//   const [blogs, setBlogs] = useState([]);
//   const [error, setError] = useState('');
//   const [searchQuery, setSearchQuery] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [blogsPerPage] = useState(3); // ✅ Fixed number of blogs per page

//   const navigate = useNavigate();

//   // ✅ Fetch Blogs
//   const fetchBlogs = async () => {
//     try {
//       const token = localStorage.getItem("accessToken");

//       const headers = {
//         "Content-Type": "application/json",
//         ...(token ? { Authorization: `Bearer ${token}` } : {}),
//       };

//       const response = await fetch("http://127.0.0.1:8000/api/blogs/", {
//         method: "GET",
//         headers,
//       });

//       if (!response.ok) {
//         if (response.status === 401 && token) {
//           console.log("Access token expired. Attempting to refresh...");
//           const refreshed = await refreshAccessToken();
//           if (refreshed) {
//             await fetchBlogs(); 
//           } else {
//             throw new Error("Session expired. Please log in again.");
//           }
//         } else {
//           throw new Error("Failed to fetch blogs");
//         }
//       }

//       const data = await response.json();
//       setBlogs(data);
//     } catch (err) {
//       console.error("Error fetching blogs:", err);
//       setError(err.message || "Failed to load blogs");
//     }
//   };

//   // ✅ Refresh Access Token
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

//   // ✅ Handle Logout
//   const handleLogout = () => {
//     localStorage.removeItem("accessToken");
//     localStorage.removeItem("refreshToken");
//     localStorage.removeItem("user");
//     localStorage.removeItem("authorId");
//     localStorage.removeItem("profile_picture");
//     navigate("/login");
//   };

//   // ✅ Delete Blog
//   const handleDelete = async (id) => {
//     if (window.confirm("Are you sure you want to delete this blog?")) {
//       try {
//         const token = localStorage.getItem("accessToken");
//         const response = await fetch(`http://127.0.0.1:8000/api/blogs/${id}/delete/`, {
//           method: "DELETE",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
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

//   // ✅ Pagination Variables (Add Defensive Checks)
//   const totalBlogs = blogs?.length || 0; // ✅ Avoid undefined error
//   const totalPages = Math.ceil(totalBlogs / blogsPerPage) || 1;
//   const startIndex = (currentPage - 1) * blogsPerPage;
//   const endIndex = startIndex + blogsPerPage;
//   const currentBlogs = blogs?.slice(startIndex, endIndex) || [];

//   // ✅ Handle Page Change
//   const handlePageChange = (pageNumber) => {
//     if (pageNumber >= 1 && pageNumber <= totalPages) {
//       setCurrentPage(pageNumber);
//     }
//   };

//   // ✅ Filter Blogs by Search Query
//   const filteredBlogs = currentBlogs.filter((blog) =>
//     blog.title.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   // ✅ Fetch Blogs on Component Mount
//   useEffect(() => {
//     fetchBlogs();
//   }, []);

//   return (
//     <div className="max-w-7xl mx-auto mt-10 p-6 bg-gray-50 shadow-lg rounded-xl">
//       {/* ✅ Heading */}
//       <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">
//         📚 All Blogs
//       </h2>

//       {/* ✅ Search Bar */}
//       <input
//         type="text"
//         placeholder="Search blogs..."
//         value={searchQuery}
//         onChange={(e) => setSearchQuery(e.target.value)}
//         className="w-full border rounded-lg px-4 py-2 mb-4"
//       />

//       {/* ✅ Error Message */}
//       {error && (
//         <p className="text-red-500 text-center mb-4 bg-red-100 p-2 rounded-lg">
//           {error}
//         </p>
//       )}

//       {/* ✅ Blog List */}
//       {filteredBlogs.length === 0 ? (
//         <p className="text-center text-gray-500">No blogs found.</p>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//           {filteredBlogs.map((blog) => (
//             <div key={blog.id} className="group bg-white border rounded-lg shadow-md overflow-hidden">
//               <div className="p-4">
//                 <h3 className="text-xl font-semibold">{blog.title}</h3>
//                 <p className="text-gray-600 mt-2">{blog.content}</p>
//                 <div className="flex justify-between items-center mt-4">
//                   <span>{blog.author}</span>
//                   <span>{new Date(blog.created_at).toLocaleString()}</span>
//                 </div>
//                 <div className="mt-4 flex space-x-4">
//                   <FiEye onClick={() => navigate(`/blogs/${blog.id}`)} />
//                   <FiEdit onClick={() => navigate(`/blogs/edit/${blog.id}`)} />
//                   <FiTrash onClick={() => handleDelete(blog.id)} />
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* ✅ Pagination */}
//       <div className="flex justify-center mt-6 space-x-2">
//         {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
//           <button
//             key={page}
//             onClick={() => handlePageChange(page)}
//             className={`px-4 py-2 border rounded ${
//               page === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-200'
//             }`}
//           >
//             {page}
//           </button>
//         ))}
//       </div>
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
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [blogsPerPage] = useState(3);

  const navigate = useNavigate();

  // ✅ Fetch Blogs
  const fetchBlogs = async () => {
    try {
      const token = localStorage.getItem("accessToken");

      const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
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
            await fetchBlogs();
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
      handleLogout(); 
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
        const response = await fetch(`http://127.0.0.1:8000/api/blogs/${id}/delete/`, {
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
        console.error(error);
        alert("Failed to delete blog");
      }
    }
  };

  // ✅ Pagination Variables
  const totalBlogs = blogs?.length || 0;
  const totalPages = Math.ceil(totalBlogs / blogsPerPage) || 1;
  const startIndex = (currentPage - 1) * blogsPerPage;
  const endIndex = startIndex + blogsPerPage;
  const currentBlogs = blogs?.slice(startIndex, endIndex) || [];

  // ✅ Handle Page Change
  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // ✅ Filter Blogs by Search Query
  const filteredBlogs = currentBlogs.filter((blog) =>
    blog.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

      {/* ✅ Search Bar */}
      <input
        type="text"
        placeholder="Search blogs..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full border rounded-lg px-4 py-2 mb-4"
      />

      {/* ✅ Error Message */}
      {error && (
        <p className="text-red-500 text-center mb-4 bg-red-100 p-2 rounded-lg">
          {error}
        </p>
      )}

      {/* ✅ Blog List */}
      {filteredBlogs.length === 0 ? (
        <p className="text-center text-gray-500">No blogs found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredBlogs.map((blog) => (
            <div
              key={blog.id}
              className="group bg-white border border-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-xl hover:scale-[1.02] transition duration-300 ease-in-out relative"
            >
              {/* ✅ Blog Image */}
              {blog.image && (
                <div className="w-full h-52">
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* ✅ Hover Overlay */}
              <div className="absolute inset-0 bg-white bg-opacity-40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center space-x-4">
                <FiEye
                  className="text-gray-700 text-3xl cursor-pointer hover:text-blue-500 transition transform hover:scale-110"
                  onClick={() => navigate(`/blogs/${blog.id}`)}
                />
                <FiEdit
                  className="text-gray-700 text-3xl cursor-pointer hover:text-green-500 transition transform hover:scale-110"
                  onClick={() => navigate(`/blogs/edit/${blog.id}`)}
                />
                <FiTrash
                  className="text-gray-700 text-3xl cursor-pointer hover:text-red-500 transition transform hover:scale-110"
                  onClick={() => handleDelete(blog.id)}
                />
              </div>

              {/* ✅ Blog Content */}
              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-800">{blog.title}</h3>
                <p className="text-gray-600 mt-2 line-clamp-3">{blog.content}</p>
                <div className="flex justify-between items-center text-sm text-gray-500 mt-4">
                  <span>✍️ {blog.author}</span>
                  <span>{new Date(blog.created_at).toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ✅ Pagination */}
      <div className="flex justify-center mt-6 space-x-2">
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => handlePageChange(i + 1)}
            className={`px-4 py-2 border rounded ${i + 1 === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiEye, FiEdit, FiTrash, FiMessageCircle } from "react-icons/fi";

const YourBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchYourBlogs = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) throw new Error("Please log in to view your blogs");

        const response = await fetch("http://127.0.0.1:8000/api/your-blogs/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch your blogs");

        const data = await response.json();
        setBlogs(data);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load your blogs");
      }
    };

    fetchYourBlogs();
  }, []);

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

  return (
    <div className="max-w-7xl mx-auto mt-10 p-6 bg-gray-50 shadow-lg rounded-xl">
      <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">
        ✍️ Your Blogs
      </h2>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      {blogs.length === 0 ? (
        <p className="text-center text-gray-500">You haven't created any blogs yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <div
              key={blog.id}
              className="group bg-white border border-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300 relative"
            >
              {/*  Blog Image */}
              {blog.image && (
                <div className="w-full h-52">
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/*  Hover with Transparent Blur Background */}
              <div className="absolute inset-0 bg-white bg-opacity-40 backdrop-blur-md opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center space-x-4">
                {/*  Eye Icon */}
                <FiEye
                  className="text-gray-700 text-3xl cursor-pointer hover:text-blue-500 transition transform hover:scale-110"
                  onClick={() => navigate(`/blogs/${blog.id}`)}
                />

                {/*  Edit Icon */}
                <FiEdit
                  className="text-gray-700 text-3xl cursor-pointer hover:text-green-500 transition transform hover:scale-110"
                  onClick={() => navigate(`/blogs/edit/${blog.id}`)}
                />


                {/*  Delete Icon */}
                <FiTrash
                  className="text-gray-700 text-3xl cursor-pointer hover:text-red-500 transition transform hover:scale-110"
                  onClick={() => handleDelete(blog.id)}
                />

                
              </div>

              {/* Blog Content */}
              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-800">{blog.title}</h3>
                <p className="text-gray-600 mt-2 line-clamp-3">{blog.content}</p>

                {/* ✅ Footer */}
                <div className="flex justify-between items-center text-sm text-gray-500 mt-4">
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

export default YourBlogs;

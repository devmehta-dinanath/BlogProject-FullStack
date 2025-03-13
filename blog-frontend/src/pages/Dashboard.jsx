import { useEffect, useState } from 'react';

const Dashboard = () => {
  const [blogs, setBlogs] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const token = localStorage.getItem("accessToken"); // Retrieve stored token
    
        const response = await fetch("http://127.0.0.1:8000/api/blogs/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "", // Add token if available
          },
        });
    
        if (!response.ok) {
          throw new Error("Failed to fetch blogs");
        }
    
        const data = await response.json();
        setBlogs(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load blogs");
      }
    };
    
  //   const fetchBlogs = async () => {
  //     try {
  //       const response = await fetch('http://127.0.0.1:8000/api/blogs/');
  //       if (!response.ok) {
  //         throw new Error('Failed to fetch blogs');
  //       }
  //       const data = await response.json();
  //       setBlogs(data);
  //     } catch (err) {
  //       console.error(err);
  //       setError('Failed to load blogs');
  //     }
  //   };

    fetchBlogs();
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* ✅ Heading */}
      <h2 className="text-3xl font-bold mb-6 text-center">📚 Your Blogs</h2>

      {/* ✅ Error Message */}
      {error && <div className="text-red-500 text-center mb-4">{error}</div>}

      {/* ✅ Blog Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <div
            key={blog.id}
            className="bg-white border rounded-lg shadow-lg hover:shadow-xl transition duration-300"
          >
            {/* ✅ Blog Image */}
            {blog.image && (
              <img
                src={blog.image}
                alt={blog.title}
                className="h-48 w-full object-cover rounded-t-lg"
              />
            )}

            {/* ✅ Blog Content */}
            <div className="p-4">
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {blog.title}
              </h3>
              <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                {blog.content}
              </p>

              {/* ✅ Footer */}
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>✍️ {blog.author}</span>
                <span>{new Date(blog.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;

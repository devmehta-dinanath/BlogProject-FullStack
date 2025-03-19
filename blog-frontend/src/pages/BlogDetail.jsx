
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  //  Fetch Blog Function
  const fetchBlog = async () => {
    setLoading(true); // ✅ Start loading
  
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/blogs/${id}/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch blog");
      }
  
      const data = await response.json();
      setBlog(data);
    } catch (error) {
      console.error("Error fetching blog:", error);
      setError("Failed to load blog");
    } finally {
      setLoading(false); // ✅ Stop loading after fetch attempt
    }
  };
  

  // ✅ Fetch Comments Function
  const fetchComments = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("Unauthorized. Please log in.");

      const response = await fetch(`http://127.0.0.1:8000/api/blogs/${id}/comments/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to load comments");

      const data = await response.json();
      setComments(data);
    } catch (err) {
      console.error("Error fetching comments:", err);
      setError(err.message || "Failed to load comments");
    }
  };

// Post New Comment Function
const handlePostComment = async () => {
  if (!newComment.trim()) return;

  try {
    const token = localStorage.getItem("accessToken");
    if (!token) throw new Error("Unauthorized. Please log in.");

    // ✅ FIXED: Changed endpoint to `/comments/create/`
    const response = await fetch(`http://127.0.0.1:8000/api/blogs/${id}/comments/create/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content: newComment }),
    });

    if (!response.ok) throw new Error("Failed to post comment");

    const newCommentData = await response.json();
    setComments([...comments, newCommentData]);
    setNewComment('');
  } catch (err) {
    console.error("Error posting comment:", err);
    setError(err.message || "Failed to post comment");
  }
};



  // Delete Comment Function
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("Unauthorized. Please log in.");

      const response = await fetch(`http://127.0.0.1:8000/api/blogs/${id}/comments/${commentId}/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete comment");

      setComments((prevComments) =>
        prevComments.filter((comment) => comment.id !== commentId)
      ); // ✅ Remove from state immediately
    } catch (err) {
      console.error("Error deleting comment:", err);
      setError(err.message || "Failed to delete comment");
    }
  };

  // Logout Function
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  useEffect(() => {
    fetchBlog();
    fetchComments(); // Fetch comments when the page loads
  }, [id]);

  // Display Loading State
  if (loading) {
    return <p className="text-center text-gray-500 mt-6">Loading blog details...</p>;
  }

  //  Display Error Message
  if (error) {
    return (
      <div className="text-red-500 text-center mt-6">
        {error}
        <button
          onClick={fetchBlog}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl border border-gray-200">
      {/* Blog Title */}
      <h2 className="text-3xl font-extrabold text-gray-800 mb-4">{blog.title}</h2>

      {/* Blog Image */}
      {blog.image && (
        <img
          src={blog.image}
          alt={blog.title}
          className="w-full h-auto object-cover rounded-lg mb-4"
        />
      )}

      {/* Blog Content */}
      <p className="text-gray-600 mb-6 leading-relaxed">{blog.content}</p>

      {/* Blog Metadata */}
      <div className="flex justify-between items-center text-sm text-gray-500 mt-4 border-t pt-4">
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

      {/* Comment Section */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Comments</h3>

        {/*  Render Existing Comments */}
        {comments.map((comment) => (
          <div key={comment.id} className="bg-gray-100 p-3 rounded-lg mb-2">
            <p className="text-gray-700">{comment.content}</p>
            <div className="flex justify-between text-sm text-gray-500 mt-1">
              <span>By: {comment.author}</span>
              <button
                onClick={() => handleDeleteComment(comment.id)}
                className="text-red-500 hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        {/*  Comment Input */}
        <div className="flex mt-4">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 p-2 border rounded-l-lg"
          />
          <button
            onClick={handlePostComment}
            className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700"
          >
            Post
          </button>
        </div>
      </div>

      {/* Go Back Button */}
      <button
        onClick={() => navigate("/dashboard")}
        className="mt-6 px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
      >
        Back to Blogs
      </button>
    </div>
  );
};

export default BlogDetail;


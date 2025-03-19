import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");

  // ✅ Fetch Existing Blog Data
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/blogs/${id}/`);
        if (!response.ok) throw new Error("Failed to fetch blog");

        const data = await response.json();
        setTitle(data.title);
        setContent(data.content);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchBlog();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const formData = new FormData();
      formData.append("content", content);
      if (image) formData.append("image", image);
  
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`http://127.0.0.1:8000/api/blogs/${id}/update/`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
  
      if (!response.ok) {
        const data = await response.json(); // ✅ Log detailed error message
        console.error("Error details:", data);
        throw new Error(data.detail || "Failed to update blog");
      }
  
      alert("Blog updated successfully");
      navigate("/your-blogs");
    } catch (error) {
      console.error("Error:", error);
      setError(error.message);
    }
  };
  

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Edit Blog</h2>
      {error && <p className="text-red-500">{error}</p>}

      <form onSubmit={handleSubmit}>
        {/* ✅ Title (Read-Only) */}
        <div className="mb-4">
          <label className="block font-semibold">Title:</label>
          <input
            type="text"
            value={title}
            readOnly
            className="w-full border-gray-300 rounded-md p-2 bg-gray-100 cursor-not-allowed"
          />
        </div>

        {/* ✅ Content */}
        <div className="mb-4">
          <label className="block font-semibold">Content:</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="6"
            className="w-full border-gray-300 rounded-md p-2"
            required
          />
        </div>

        {/* ✅ Image */}
        <div className="mb-4">
          <label className="block font-semibold">Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            className="border-gray-300 rounded-md p-2"
          />
        </div>

        {/* ✅ Submit */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
        >
          Update Blog
        </button>
      </form>
    </div>
  );
};

export default EditBlog;

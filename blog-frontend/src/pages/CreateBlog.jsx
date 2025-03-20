import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateBlog = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  //  Fetch `authorId` properly on component mount
  const [authorId, setAuthorId] = useState(null);

  useEffect(() => {
    const storedAuthorId = localStorage.getItem('authorId') || sessionStorage.getItem('authorId');
    // console.log("Fetched Author ID:", storedAuthorId); // Debugging log
    if (storedAuthorId) {
      setAuthorId(parseInt(storedAuthorId)); // ✅ Convert to integer
    }
  }, []);

  //  Handle Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Get token from localStorage
    const token = localStorage.getItem('accessToken');

    if (!token) {
      setError('You need to log in to create a blog.');
      return;
    }

    if (!authorId) {
      setError('Author ID is missing. Please log in again.');
      return;
    }

    // Prepare FormData
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('author_id', authorId); //  Send author_id as integer
    if (image) {
      formData.append('image', image);
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/api/blogs/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`, //  Send token in header
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error creating blog:', errorData);
        setError(`Failed to create blog: ${errorData?.detail || "Invalid data"}`);
        toast.error(`❌ ${errorData?.detail || "Failed to create blog"}`);
        return;
      }

      //  Show Success Message
      toast.success(" Blog created successfully!");

      // ✅ Redirect to dashboard after success
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      console.error('Network error:', err);
      setError('Network error while creating blog');
      toast.error("❌ Network error while creating blog");
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-6 mt-10">
      {/*  Heading */}
      <h2 className="text-2xl font-bold mb-4">Create a New Blog</h2>

      {/* Error Message */}
      {error && <div className="text-red-500 mb-4">{error}</div>}

      {/*  Blog Form */}
      <form onSubmit={handleSubmit}>
        {/*  Title */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold">Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/*  Content */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold">Content:</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full border rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="6"
            required
          />
        </div>

        {/* Image Upload */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold">Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            className="w-full border rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/*  Submit Button */}
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300"
        >
          Create Blog
        </button>
      </form>
    </div>
  );
};

export default CreateBlog;

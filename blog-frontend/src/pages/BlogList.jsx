import { useEffect, useState } from "react";
import { getAllBlogPosts } from "../pages/api"; // Import API function

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const data = await getAllBlogPosts();
        setBlogs(data);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">All Blog Posts</h2>
      {blogs.map((blog) => (
        <div key={blog.id} className="border p-4 rounded-lg mb-4">
          <h3 className="text-xl font-bold">{blog.title}</h3>
          <p>{blog.content}</p>
          {blog.image && <img src={blog.image} alt={blog.title} className="mt-2 w-full h-48 object-cover" />}
        </div>
      ))}
    </div>
  );
};

export default BlogList;

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const ChangePassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  // Get logged-in user's email from localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser && storedUser.email) {
      setEmail(storedUser.email);
    }
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (loading) return; // Prevent double submission
    setLoading(true);

    const toastId = toast.loading("⏳ Sending password reset link...");

    try {
      const response = await fetch(`${BASE_URL}/api/auth/password-reset/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (response.status === 200) {
        toast.update(toastId, {
          render: "✅ Password reset link has been sent to your email.",
          type: "success",
          isLoading: false,
          autoClose: 3000,
          icon: false,
        });
      } else {
        toast.update(toastId, {
          render: data.error || "❌ Invalid email address.",
          type: "error",
          isLoading: false,
          autoClose: 3000,
          icon: false,
        });
      }
    } catch (error) {
      console.error("Password reset error:", error);
      toast.update(toastId, {
        render: "❌ Something went wrong. Please try again.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
        icon: false,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="p-6 bg-white shadow-lg rounded-lg w-96">
        <h2 className="text-2xl font-bold text-gray-800 text-center">
          Change Password
        </h2>
        
        {/* Email Input (Auto-filled & Read-Only) */}
        <input
          type="email"
          value={email}
          readOnly
          className="w-full border p-2 mt-4 rounded-lg bg-gray-100 cursor-not-allowed"
        />

        {/* Submit Button */}
        <button
          type="submit"
          className={`w-full text-white py-2 mt-4 rounded-lg ${
            loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
          }`}
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;

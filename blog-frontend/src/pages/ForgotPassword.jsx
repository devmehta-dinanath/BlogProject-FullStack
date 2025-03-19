
import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("❌ Please enter a valid email.");
      return;
    }

    if (loading) return; // Prevent double submission
    setLoading(true);

    const toastId = toast.loading("⏳ Sending password reset link...");

    try {
      const response = await fetch("http://127.0.0.1:8000/api/auth/password-reset/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (response.status === 200) {
        toast.update(toastId, {
          render: " Password reset link has been sent to your email.",
          type: "success",
          isLoading: false,
          autoClose: 3000,
          icon: false, // Remove duplicate icon
        });
        setEmail(""); // Reset input field
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
      <form
        onSubmit={handleSubmit}
        className="p-6 bg-white shadow-lg rounded-lg w-96"
      >
        <h2 className="text-2xl font-bold text-gray-800 text-center">
          Forgot Password
        </h2>
        
        {/*  Email Input */}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="w-full border p-2 mt-4 rounded-lg focus:ring-2 focus:ring-blue-500"
          required
        />

        {/*  Submit Button */}
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

export default ForgotPassword;
